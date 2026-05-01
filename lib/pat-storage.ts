// localStorage helpers for the PAT flow.
//
// Two keys are owned here:
//   pat_eligible        - "yes" | "no" answer to the eligibility gate
//   pat_progress_v1     - in-progress test state for resume on reload
//
// All reads / writes are wrapped in try/catch so private mode and disabled
// storage do not break the flow.

const ELIGIBLE_KEY = "pat_eligible";
const PROGRESS_KEY = "pat_progress_v1";

export type PATEligibleAnswer = "yes" | "no";

export interface PATProgress {
  eligibility: PATEligibleAnswer | null;
  identityCaptured: boolean;
  identity: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    city?: string;
  };
  // Index of the question the user is currently on (0-based, refers to
  // PAT_QUESTIONS array order).
  currentQuestionIndex: number;
  // Per-question answers keyed by questionId. Values are the chosen option
  // index for radio questions, or the typed string for text questions.
  answersById: Record<string, string | number>;
  // ISO timestamp when this snapshot was last touched. Used to invalidate
  // stale resumes (older than 7 days).
  updatedAt: string;
}

const MAX_RESUME_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function readEligibility(): PATEligibleAnswer | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(ELIGIBLE_KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function writeEligibility(answer: PATEligibleAnswer): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ELIGIBLE_KEY, answer);
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearEligibility(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ELIGIBLE_KEY);
  } catch {
    // ignore
  }
}

export function readProgress(): PATProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PATProgress> | null;
    if (!parsed || typeof parsed !== "object") return null;

    // Stale snapshot? Drop it.
    if (typeof parsed.updatedAt === "string") {
      const ageMs = Date.now() - new Date(parsed.updatedAt).getTime();
      if (Number.isFinite(ageMs) && ageMs > MAX_RESUME_AGE_MS) {
        clearProgress();
        return null;
      }
    }

    return {
      eligibility: parsed.eligibility ?? null,
      identityCaptured: !!parsed.identityCaptured,
      identity: parsed.identity ?? {},
      currentQuestionIndex:
        typeof parsed.currentQuestionIndex === "number"
          ? parsed.currentQuestionIndex
          : 0,
      answersById:
        parsed.answersById && typeof parsed.answersById === "object"
          ? parsed.answersById
          : {},
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeProgress(progress: PATProgress): void {
  if (typeof window === "undefined") return;
  try {
    const stamped: PATProgress = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(stamped));
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
}

// Returns true when there is a meaningful resume target (past the gate, with
// at least one answer or any identity captured - even just the mini-mode
// first name).
export function hasResumeableProgress(): boolean {
  const p = readProgress();
  if (!p) return false;
  if (p.eligibility !== "yes") return false;
  const hasAnswers = Object.keys(p.answersById).length > 0;
  const hasMiniIdentity = !!p.identity?.firstName;
  return (
    p.identityCaptured ||
    hasMiniIdentity ||
    hasAnswers ||
    p.currentQuestionIndex > 0
  );
}
