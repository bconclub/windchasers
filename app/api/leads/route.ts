import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// PROXe leads proxy - single forwarding route for every website form capture.
//
// Replaces the dead build.goproxe.com/webhook/* URLs with a real proxy that
// authenticates with the PROXe backend and forwards a normalised payload.
//
// CONSOLIDATED ENDPOINT: every type (pat | page | event) posts to the SAME
// upstream endpoint (POST /api/agent/leads/inbound) with the SAME key
// (PROXE_INBOUND_API_KEY). The three types differ only in the upstream
// payload shape - `source`, `notes`, and `custom_fields.form_type` are how
// PROXe distinguishes them downstream.
//
// Required env vars (set on VPS / Vercel; add stubs to .env.local for dev):
//   PROXE_BASE_URL=https://proxe.windchasers.in
//   PROXE_INBOUND_API_KEY=<from PROXe team>
//
// Logging: every request is correlated by a request_id (uuid v4). PII is
// masked. API keys are NEVER logged.
// =============================================================================

type LeadType = "pat" | "page" | "event";
type Audience = "student" | "parent" | "early_stage";

interface LeadRequest {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  audience?: Audience;
  page_url?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  data: Record<string, unknown>;
}

const UPSTREAM_TIMEOUT_MS = 10_000;
const VALID_TYPES: ReadonlySet<LeadType> = new Set<LeadType>([
  "pat",
  "page",
  "event",
]);
const VALID_AUDIENCES: ReadonlySet<Audience> = new Set<Audience>([
  "student",
  "parent",
  "early_stage",
]);

// ---------------------------------------------------------------------------
// Phone normalisation - strip whitespace / dashes / parens, default country
// code to +91, validate digit length 10-15.
// ---------------------------------------------------------------------------
function normalizePhone(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;

  // Strip whitespace, dashes, parens, dots.
  let p = raw.replace(/[\s\-()\.]/g, "").trim();
  if (!p) return null;

  // If user typed "00" prefix, treat as international and replace with +.
  if (p.startsWith("00")) p = "+" + p.slice(2);

  // No country code => assume +91 (India).
  if (!p.startsWith("+")) p = "+91" + p;

  // Validate digit count after the leading +.
  const digits = p.slice(1).replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;

  return "+" + digits;
}

function maskPhone(phone: string): string {
  if (!phone) return "";
  if (phone.length <= 7) return phone.replace(/.(?=.{2})/g, "x");
  return phone.slice(0, 3) + "xxxxxx" + phone.slice(-4);
}

function log(entry: Record<string, unknown>): void {
  // Single-line JSON for easy grep / pm2 log piping.
  console.log(JSON.stringify({ tag: "leads_proxy", ...entry }));
}

// ---------------------------------------------------------------------------
// Method gating - 405 for everything except POST.
// ---------------------------------------------------------------------------
function methodNotAllowed(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: "method_not_allowed",
      message: "Only POST is supported on /api/leads",
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function GET() {
  return methodNotAllowed();
}
export async function PUT() {
  return methodNotAllowed();
}
export async function DELETE() {
  return methodNotAllowed();
}
export async function PATCH() {
  return methodNotAllowed();
}

// ---------------------------------------------------------------------------
// POST handler - validate, route, forward, return.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  let typeForResponse: LeadType = "page"; // safe fallback for early errors

  try {
    // ---- Parse JSON body ---------------------------------------------------
    let body: LeadRequest;
    try {
      body = (await request.json()) as LeadRequest;
    } catch {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "invalid_json",
      });
      return errorResponse({
        type: typeForResponse,
        error: "validation",
        message: "Request body must be valid JSON",
        status: 400,
      });
    }

    // ---- Validate type ----------------------------------------------------
    const type = body?.type;
    if (!type || !VALID_TYPES.has(type)) {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "invalid_type",
      });
      return errorResponse({
        type: typeForResponse,
        error: "validation",
        message: "type must be one of: pat, page, event",
        status: 400,
      });
    }
    typeForResponse = type;

    // ---- Validate audience (if provided) ----------------------------------
    if (body.audience && !VALID_AUDIENCES.has(body.audience)) {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "invalid_audience",
      });
      return errorResponse({
        type,
        error: "validation",
        message: "audience must be one of: student, parent, early_stage",
        status: 400,
      });
    }

    // ---- Validate name + phone -------------------------------------------
    const name = (body.name ?? "").toString().trim();
    if (!name) {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "name_missing",
      });
      return errorResponse({
        type,
        error: "validation",
        message: "name is required",
        status: 400,
      });
    }

    if (!body.phone || !body.phone.toString().trim()) {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "phone_missing",
      });
      return errorResponse({
        type,
        error: "validation",
        message: "phone is required",
        status: 400,
      });
    }

    const phone = normalizePhone(body.phone.toString());
    if (!phone) {
      log({
        stage: "validation_failed",
        request_id: requestId,
        reason: "phone_invalid",
      });
      return errorResponse({
        type,
        error: "validation",
        message:
          "phone must be a valid number (10 to 15 digits after country code)",
        status: 400,
      });
    }

    // ---- Stamp request received -----------------------------------------
    const data = (body.data ?? {}) as Record<string, unknown>;
    const utm = body.utm ?? {};
    const formNameField = data.form_name;
    const eventNameField = data.event_name;
    log({
      stage: "received",
      request_id: requestId,
      type,
      phone_masked: maskPhone(phone),
      audience: body.audience,
      form_name:
        typeof formNameField === "string" ? formNameField : undefined,
      event_name:
        typeof eventNameField === "string" ? eventNameField : undefined,
    });

    // ---- Resolve env config ---------------------------------------------
    const baseUrl = (process.env.PROXE_BASE_URL ?? "").trim();
    const inboundKey = (process.env.PROXE_INBOUND_API_KEY ?? "").trim();

    if (!baseUrl) {
      log({
        stage: "error",
        request_id: requestId,
        error: "config_missing",
        details: "PROXE_BASE_URL is not set",
      });
      return errorResponse({
        type,
        error: "auth",
        message: "PROXe base URL is not configured on the server",
        status: 500,
      });
    }

    if (!inboundKey) {
      log({
        stage: "error",
        request_id: requestId,
        error: "config_missing",
        details: "PROXE_INBOUND_API_KEY is not set",
      });
      return errorResponse({
        type,
        error: "auth",
        message: "PROXe API key is not configured on the server",
        status: 500,
      });
    }

    // ---- Build upstream payload (single endpoint, single key) ------------
    // Every type forwards to /api/agent/leads/inbound. PROXe distinguishes
    // them via `source`, `notes`, and `custom_fields.form_type`.
    const upstreamUrl = `${baseUrl.replace(/\/+$/, "")}/api/agent/leads/inbound`;
    const upstreamApiKey = inboundKey;
    let upstreamPayload: Record<string, unknown>;

    switch (type) {
      case "pat": {
        const scores = (data.scores ?? {}) as Record<string, unknown>;
        upstreamPayload = {
          name,
          phone,
          email: body.email,
          source: "pat",
          campaign: utm.campaign ?? null,
          city: body.city,
          brand: "windchasers",
          custom_fields: {
            form_type: "pilot_aptitude_test",
            audience: body.audience,
            page_url: body.page_url,
            tier: data.tier,
            total_score: scores.total,
            qualification_score: scores.qualification,
            aptitude_score: scores.aptitude,
            readiness_score: scores.readiness,
            eligible_class_12_pass: data.eligible_class_12_pass,
            answers: data.answers,
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign,
            utm_term: utm.term,
            utm_content: utm.content,
          },
        };
        break;
      }

      case "page": {
        // Landing-page captures (guide download, hero CTAs, generic forms).
        // form_name disambiguates which page / which form.
        const formName =
          typeof data.form_name === "string" ? data.form_name : "page";
        upstreamPayload = {
          name,
          phone,
          email: body.email,
          source: "page",
          campaign: utm.campaign ?? null,
          city: body.city,
          brand: "windchasers",
          notes: formName,
          custom_fields: {
            form_type: formName,
            audience: body.audience,
            page_url: body.page_url,
            course_interest: data.course_interest,
            training_type: data.training_type,
            user_type: body.audience,
            timeline: data.timeline,
            message: data.message,
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign,
            utm_term: utm.term,
            utm_content: utm.content,
          },
        };
        break;
      }

      case "event": {
        // Visit / demo / eligibility events. event_name lives in `notes` (so
        // counsellors see it on the lead) and in `custom_fields.form_type`.
        const { event_name, ...restData } = data;
        const eventLabel =
          typeof event_name === "string" ? event_name : "event";
        upstreamPayload = {
          name,
          phone,
          email: body.email,
          source: "event",
          campaign: utm.campaign ?? null,
          city: body.city,
          brand: "windchasers",
          notes: eventLabel,
          custom_fields: {
            form_type: eventLabel,
            audience: body.audience,
            page_url: body.page_url,
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign,
            utm_term: utm.term,
            utm_content: utm.content,
            ...restData,
          },
        };
        break;
      }
    }

    // ---- Forward to PROXe with timeout -----------------------------------
    log({
      stage: "upstream_request",
      request_id: requestId,
      endpoint: upstreamUrl,
      type,
    });

    const startedAt = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      UPSTREAM_TIMEOUT_MS
    );

    let upstreamRes: Response;
    try {
      upstreamRes = await fetch(upstreamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": upstreamApiKey,
        },
        body: JSON.stringify(upstreamPayload),
        signal: controller.signal,
        // Disable Next.js fetch caching for proxied submissions.
        cache: "no-store",
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      const isAbort =
        fetchErr instanceof DOMException && fetchErr.name === "AbortError";
      const message = isAbort
        ? `PROXe upstream timed out after ${UPSTREAM_TIMEOUT_MS}ms`
        : fetchErr instanceof Error
          ? fetchErr.message
          : String(fetchErr);
      log({
        stage: "error",
        request_id: requestId,
        error: "upstream_unreachable",
        details: message,
      });
      return errorResponse({
        type,
        error: "upstream",
        message: "PROXe upstream is unreachable",
        status: 502,
      });
    }
    clearTimeout(timeoutId);

    const elapsedMs = Date.now() - startedAt;

    // ---- Parse upstream response (separate from network errors) -----------
    let upstreamJson:
      | { lead_id?: string; is_new?: boolean; message?: string; error?: string; raw?: string }
      | null = null;
    try {
      const text = await upstreamRes.text();
      if (text && text.trim()) {
        try {
          upstreamJson = JSON.parse(text);
        } catch {
          upstreamJson = { raw: text };
        }
      }
    } catch (readErr) {
      log({
        stage: "error",
        request_id: requestId,
        error: "upstream_read_failed",
        details:
          readErr instanceof Error ? readErr.message : String(readErr),
      });
    }

    log({
      stage: "upstream_response",
      request_id: requestId,
      status: upstreamRes.status,
      lead_id: upstreamJson?.lead_id,
      ms: elapsedMs,
    });

    // ---- Auth failure from PROXe -----------------------------------------
    if (upstreamRes.status === 401 || upstreamRes.status === 403) {
      return errorResponse({
        type,
        error: "auth",
        message:
          typeof upstreamJson?.message === "string"
            ? upstreamJson.message
            : "PROXe rejected our credentials",
        status: 401,
        upstream_status: upstreamRes.status,
      });
    }

    // ---- Other upstream errors ------------------------------------------
    if (!upstreamRes.ok) {
      return errorResponse({
        type,
        error: "upstream",
        message:
          typeof upstreamJson?.message === "string"
            ? upstreamJson.message
            : typeof upstreamJson?.error === "string"
              ? upstreamJson.error
              : "PROXe returned an error",
        status: 502,
        upstream_status: upstreamRes.status,
      });
    }

    // ---- Success -------------------------------------------------------
    return NextResponse.json(
      {
        ok: true,
        type,
        lead_id: upstreamJson?.lead_id,
        is_new:
          typeof upstreamJson?.is_new === "boolean"
            ? upstreamJson.is_new
            : undefined,
        message:
          typeof upstreamJson?.message === "string"
            ? upstreamJson.message
            : undefined,
      },
      { status: 200 }
    );
  } catch (err) {
    log({
      stage: "error",
      request_id: requestId,
      error: "unknown",
      details: err instanceof Error ? err.message : String(err),
    });
    return errorResponse({
      type: typeForResponse,
      error: "unknown",
      message: "Internal server error",
      status: 500,
    });
  }
}

// ---------------------------------------------------------------------------
// Error response helper - keeps response shape consistent.
// ---------------------------------------------------------------------------
interface ErrorResponseInput {
  type: LeadType;
  error: "validation" | "upstream" | "auth" | "unknown";
  message: string;
  status: number;
  upstream_status?: number;
}

function errorResponse(input: ErrorResponseInput): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      type: input.type,
      error: input.error,
      message: input.message,
      ...(input.upstream_status !== undefined
        ? { upstream_status: input.upstream_status }
        : {}),
    },
    { status: input.status }
  );
}
