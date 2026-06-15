// =============================================================================
// Shared PROXe lead forwarder.
//
// Server routes call this to push a lead into PROXe's inbound endpoint
// (POST {PROXE_BASE_URL}/api/agent/leads/inbound, x-api-key). We hit PROXe
// directly rather than via /api/leads because the VPS Node process can't
// reliably self-fetch its own public hostname (nginx/SSL termination).
//
// Non-throwing: returns { ok, leadId?, error? } so a PROXe outage never breaks
// a form submission (the route keeps its Sheets write as a backup).
//
// Attribution: forms across the site send utm/click fields in different shapes
// (flat snake_case, camelCase, or nested under utmParams/clickIds). resolve*
// below normalises all of them.
// =============================================================================

const UPSTREAM_TIMEOUT_MS = 10_000;

type ProxeResponse = { lead_id?: string; message?: string; error?: string };

function str(v: unknown): string {
  return typeof v === "string" && v ? v : "";
}
function pick(obj: Record<string, unknown> | undefined, ...keys: string[]): string {
  if (!obj) return "";
  for (const k of keys) {
    const s = str(obj[k]);
    if (s) return s;
  }
  return "";
}

export interface ProxeLeadInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  /** PROXe source bucket. */
  source?: "page" | "event" | "pat";
  /** What kind of lead (becomes form_type + notes). */
  formType: string;
  /** Raw form body, used to resolve utm/click/referrer attribution. */
  data: Record<string, unknown>;
  /** Extra custom_fields to merge (form-specific details). */
  fields?: Record<string, unknown>;
}

export async function forwardLeadToProxe(
  input: ProxeLeadInput,
): Promise<{ ok: boolean; leadId?: string; error?: string }> {
  const baseUrl = (process.env.PROXE_BASE_URL ?? "").trim();
  const apiKey = (process.env.PROXE_INBOUND_API_KEY ?? "").trim();
  if (!baseUrl || !apiKey) return { ok: false, error: "PROXe not configured" };
  if (!input.name?.trim() || !input.phone?.trim()) return { ok: false, error: "name/phone required" };

  const d = input.data || {};
  const utm = (d.utmParams as Record<string, unknown>) ?? d;
  const click =
    (d.clickIds as Record<string, unknown>) ??
    (d.click_ids as Record<string, unknown>) ??
    d;

  const utmSource = pick(d, "utm_source", "utmSource") || pick(utm, "utm_source", "utmSource");
  const utmMedium = pick(d, "utm_medium", "utmMedium") || pick(utm, "utm_medium", "utmMedium");
  const utmCampaign = pick(d, "utm_campaign", "utmCampaign") || pick(utm, "utm_campaign", "utmCampaign");
  const utmTerm = pick(d, "utm_term", "utmTerm") || pick(utm, "utm_term", "utmTerm");
  const utmContent = pick(d, "utm_content", "utmContent") || pick(utm, "utm_content", "utmContent");
  const gclid = pick(d, "gclid") || pick(click, "gclid");
  const fbclid = pick(d, "fbclid") || pick(click, "fbclid");
  const msclkid = pick(d, "msclkid") || pick(click, "msclkid");
  const ttclid = pick(d, "ttclid") || pick(click, "ttclid");
  const liFatId = pick(d, "li_fat_id") || pick(click, "li_fat_id");
  const twclid = pick(d, "twclid") || pick(click, "twclid");
  const wbraid = pick(d, "wbraid") || pick(click, "wbraid");
  const gbraid = pick(d, "gbraid") || pick(click, "gbraid");
  const referrer = pick(d, "referrer");
  const landingUrl = pick(d, "landing_page", "landing_url", "landingUrl", "page_url");
  const rawTraffic = pick(d, "traffic_source");
  const trafficSource = rawTraffic.toLowerCase().startsWith("referral:") ? "" : rawTraffic;
  const hasClickId = !!(gclid || fbclid || msclkid || ttclid || liFatId || twclid || wbraid || gbraid);
  const channel =
    utmSource ||
    (fbclid ? "facebook_ads" : "") ||
    (gclid || wbraid || gbraid ? "google_ads" : "") ||
    (msclkid ? "bing_ads" : "") ||
    (ttclid ? "tiktok_ads" : "") ||
    (liFatId ? "linkedin_ads" : "") ||
    (twclid ? "twitter_ads" : "") ||
    trafficSource ||
    "direct";

  const payload = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email || undefined,
    source: input.source ?? "page",
    campaign: utmCampaign || null,
    city: input.city || undefined,
    brand: "windchasers",
    notes: input.formType,
    custom_fields: {
      form_type: input.formType,
      ...(input.fields ?? {}),
      channel,
      traffic_source: trafficSource || undefined,
      referrer: referrer || undefined,
      landing_url: landingUrl || undefined,
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
      utm_term: utmTerm || undefined,
      utm_content: utmContent || undefined,
      gclid: gclid || undefined,
      fbclid: fbclid || undefined,
      msclkid: msclkid || undefined,
      ttclid: ttclid || undefined,
      li_fat_id: liFatId || undefined,
      twclid: twclid || undefined,
      wbraid: wbraid || undefined,
      gbraid: gbraid || undefined,
      has_click_id: hasClickId,
    },
  };

  const url = `${baseUrl.replace(/\/+$/, "")}/api/agent/leads/inbound`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    let json: ProxeResponse | null = null;
    try {
      json = (await res.json()) as ProxeResponse;
    } catch {
      /* empty / non-JSON body */
    }
    if (!res.ok) return { ok: false, error: json?.message || json?.error || `PROXe ${res.status}` };
    return { ok: true, leadId: json?.lead_id };
  } catch (e) {
    const isAbort = e instanceof DOMException && e.name === "AbortError";
    return { ok: false, error: isAbort ? "PROXe timeout" : (e as Error).message };
  } finally {
    clearTimeout(timeout);
  }
}
