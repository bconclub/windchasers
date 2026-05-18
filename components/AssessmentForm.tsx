"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EligibilityGate from "@/components/assessment/EligibilityGate";
import IdentityCapture, {
  type IdentityFields,
} from "@/components/assessment/IdentityCapture";
import QuestionScreen from "@/components/assessment/QuestionScreen";
import ResumePrompt from "@/components/assessment/ResumePrompt";
import SubmittingState from "@/components/assessment/SubmittingState";

import {
  PAT_QUESTIONS,
  PAT_QUESTION_COUNT,
  PAT_SECTION_HEADERS,
} from "@/lib/pat-questions";
import { scoreAnswers, type PATAnswerInput } from "@/lib/pat-scoring";
import {
  readEligibility,
  writeEligibility,
  readProgress,
  writeProgress,
  clearProgress,
  hasResumeableProgress,
  type PATProgress,
} from "@/lib/pat-storage";
import {
  trackFormSubmission,
  getStoredUTMParamsFull,
  recordAssessmentSession,
} from "@/lib/tracking";
import {
  trackPilotLead,
  trackAssessmentStarted,
} from "@/lib/analytics";
import {
  getUserSessionData,
  saveUserSessionData,
  markAssessmentCompleted,
} from "@/lib/sessionStorage";

type Phase =
  | "loading"
  | "resume_prompt"
  | "gate"
  | "identity_mini"
  | "questions"
  | "identity_full"
  | "submitting"
  | "error";

interface ErrorState {
  message: string;
}

function emptyProgress(): PATProgress {
  return {
    eligibility: null,
    identityCaptured: false,
    identity: {},
    currentQuestionIndex: 0,
    answersById: {},
    updatedAt: new Date().toISOString(),
  };
}

function isAllAnswered(answersById: Record<string, string | number>): boolean {
  return PAT_QUESTIONS.every((q) => {
    const v = answersById[String(q.id)];
    return v !== "" && v !== null && v !== undefined;
  });
}

export default function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState<PATProgress>(() => emptyProgress());
  const [error, setError] = useState<ErrorState | null>(null);

  const sourceFrom = useMemo(() => searchParams?.get("from") ?? null, [searchParams]);
  const startedFiredRef = useRef(false);

  // ---- Hydrate from localStorage on mount -----------------------------------
  useEffect(() => {
    const stored = readProgress();
    const eligibilityFromKey = readEligibility();

    if (stored && hasResumeableProgress()) {
      setProgress(stored);
      setPhase("resume_prompt");
      return;
    }

    if (eligibilityFromKey === "no") {
      // User previously answered No on this device. Send them to /early.
      router.replace("/assessment/early");
      return;
    }

    if (eligibilityFromKey === "yes") {
      // Past gate. Pull anything we already know about them from sessionStorage
      // (interest pages, prior submissions) so we can short-circuit identity_mini.
      const userData = getUserSessionData();
      if (userData?.firstName) {
        setProgress((prev) => ({
          ...prev,
          eligibility: "yes",
          identity: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
          },
        }));
        setPhase("questions");
      } else {
        setProgress((prev) => ({ ...prev, eligibility: "yes" }));
        setPhase("identity_mini");
      }
      return;
    }

    setPhase("gate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist progress on every meaningful change
  useEffect(() => {
    if (phase === "loading" || phase === "resume_prompt" || phase === "gate") return;
    writeProgress(progress);
  }, [progress, phase]);

  // GA4 assessment_started fires once per visit when the user enters the
  // question phase from the Yes path.
  useEffect(() => {
    if (phase === "questions" && !startedFiredRef.current) {
      startedFiredRef.current = true;
      trackAssessmentStarted({ audience: "student" });
    }
  }, [phase]);

  // ---- Gate handlers --------------------------------------------------------
  function handleGateAnswer(answer: "yes" | "no") {
    writeEligibility(answer);
    if (answer === "no") {
      clearProgress();
      router.push("/assessment/early");
      return;
    }
    const next: PATProgress = { ...emptyProgress(), eligibility: "yes" };
    setProgress(next);
    setPhase("identity_mini");
  }

  // ---- Resume handlers ------------------------------------------------------
  function handleResume() {
    if (!progress.eligibility) {
      setPhase("gate");
      return;
    }
    if (!progress.identity?.firstName) {
      setPhase("identity_mini");
      return;
    }
    if (isAllAnswered(progress.answersById) && !progress.identityCaptured) {
      setPhase("identity_full");
      return;
    }
    setPhase("questions");
  }

  function handleStartOver() {
    clearProgress();
    setProgress(emptyProgress());
    setPhase("gate");
  }

  // ---- Identity (mini) ------------------------------------------------------
  function handleIdentityMiniSubmit(fields: Partial<IdentityFields>) {
    const firstName = (fields.firstName ?? "").trim();
    if (!firstName) return;

    saveUserSessionData({ firstName });
    setProgress((prev) => ({
      ...prev,
      identity: { ...prev.identity, firstName },
    }));
    setPhase("questions");
  }

  // ---- Identity (full) ------------------------------------------------------
  function handleIdentityFullSubmit(fields: Partial<IdentityFields>) {
    // Single-name model: firstName already holds the full name from mini.
    // lastName is unused (kept on the type for back-compat with sessionStorage).
    const completed = {
      email: (fields.email ?? "").trim(),
      phone: (fields.phone ?? "").trim(),
      city: (fields.city ?? "").trim(),
    };

    saveUserSessionData(completed);
    setProgress((prev) => {
      const merged: PATProgress = {
        ...prev,
        identityCaptured: true,
        identity: { ...prev.identity, ...completed },
      };
      // Submit immediately once full identity is captured. Pass merged so the
      // setState batching does not race the submit.
      void submitAssessment(prev.answersById, merged);
      return merged;
    });
  }

  // ---- Question handlers ----------------------------------------------------
  const currentQuestion = PAT_QUESTIONS[progress.currentQuestionIndex];
  const currentValue = currentQuestion
    ? progress.answersById[String(currentQuestion.id)]
    : undefined;

  const sectionHeader = useMemo(() => {
    if (!currentQuestion) return null;
    const match = PAT_SECTION_HEADERS.find(
      (h) => h.afterIndex === progress.currentQuestionIndex - 1
    );
    return match?.title ?? null;
  }, [progress.currentQuestionIndex, currentQuestion]);

  const isLast = progress.currentQuestionIndex === PAT_QUESTION_COUNT - 1;
  const canProceed =
    currentValue !== "" && currentValue !== undefined && currentValue !== null;

  function handleAnswer(value: string | number, autoAdvance: boolean) {
    if (!currentQuestion) return;
    const key = String(currentQuestion.id);
    setProgress((prev) => ({
      ...prev,
      answersById: { ...prev.answersById, [key]: value },
    }));

    if (!autoAdvance) return;
    window.setTimeout(() => {
      goNext({ ...progress.answersById, [key]: value });
    }, 280);
  }

  function goNext(answersById: Record<string, string | number> = progress.answersById) {
    if (progress.currentQuestionIndex < PAT_QUESTION_COUNT - 1) {
      setProgress((prev) => ({
        ...prev,
        answersById,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      // End of test. Persist any final answer, then move into identity_full.
      setProgress((prev) => ({
        ...prev,
        answersById,
      }));
      setPhase("identity_full");
    }
  }

  function goBack() {
    if (progress.currentQuestionIndex === 0) return;
    setProgress((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex - 1,
    }));
  }

  // ---- Submission -----------------------------------------------------------
  async function submitAssessment(
    answersById: Record<string, string | number>,
    snapshot: PATProgress
  ) {
    setPhase("submitting");
    setError(null);

    // PROXe-shaped answers: { question_id, answer } per the /api/leads contract.
    const answersForUpstream = PAT_QUESTIONS.map((q) => ({
      question_id: q.id,
      answer: answersById[String(q.id)] ?? null,
    }));

    // Internal scoring payload retains questionId for compatibility with
    // lib/pat-scoring (single source of truth).
    const answersForScoring: PATAnswerInput[] = PAT_QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answersById[String(q.id)] ?? null,
    }));

    // Client preview only - PROXe receives whatever the client computes.
    const preview = scoreAnswers(answersForScoring);

    const utm = getStoredUTMParamsFull();
    const identity = {
      name: (snapshot.identity.firstName ?? "").trim(),
      phone: snapshot.identity.phone ?? "",
      email: snapshot.identity.email ?? "",
      city: snapshot.identity.city ?? "",
    };
    const pageUrl = typeof window !== "undefined" ? window.location.href : undefined;

    // Fire PROXe AND the Google Sheets backup in parallel. PROXe is the CRM
    // and the system of record when it's healthy; the sheet is a permanent
    // safety net that protects us from outages (PROXe was returning 502 on
    // 2026-05-18 with a "taskErr is not defined" runtime error, losing every
    // PAT lead in that window). As long as at least one write succeeds, the
    // user proceeds to /thank-you and gets their score.

    const proxePromise: Promise<{
      ok: boolean;
      lead_id?: string;
      errorMsg?: string;
    }> = fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pat",
        name: identity.name,
        phone: identity.phone,
        email: identity.email,
        city: identity.city,
        audience: "student",
        page_url: pageUrl,
        utm: {
          source: utm.utm_source || undefined,
          medium: utm.utm_medium || undefined,
          campaign: utm.utm_campaign || undefined,
          term: utm.utm_term || undefined,
          content: utm.utm_content || undefined,
        },
        data: {
          answers: answersForUpstream,
          scores: {
            qualification: preview.subScores.qualification,
            aptitude: preview.subScores.aptitude,
            readiness: preview.subScores.readiness,
            total: preview.total,
          },
          tier: preview.tier,
          // The eligibility gate has already routed the user past Class 12;
          // Below-12 aspirants are sent to /assessment/early instead.
          eligible_class_12_pass: true,
        },
      }),
    })
      .then(async (res) => {
        const j = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          lead_id?: string;
          message?: string;
          error?: string;
        };
        if (!res.ok || j.ok === false) {
          return {
            ok: false,
            errorMsg:
              typeof j.message === "string"
                ? j.message
                : typeof j.error === "string"
                  ? j.error
                  : `PROXe ${res.status}`,
          };
        }
        return { ok: true, lead_id: j.lead_id };
      })
      .catch((err) => ({
        ok: false,
        errorMsg: err instanceof Error ? err.message : String(err),
      }));

    const sheetPromise: Promise<{ ok: boolean }> = fetch("/api/pat-backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...identity,
        audience: "student",
        page_url: pageUrl,
        total_score: preview.total,
        qualification_score: preview.subScores.qualification,
        aptitude_score: preview.subScores.aptitude,
        readiness_score: preview.subScores.readiness,
        tier: preview.tier,
        eligible_class_12_pass: true,
        answers: answersForUpstream,
        proxe_status: "pending",
        ...utm,
        utmParams: utm,
        page_path:
          typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
    })
      .then(async (res) => ({ ok: res.ok }))
      .catch(() => ({ ok: false }));

    const [proxeOutcome, sheetOutcome] = await Promise.all([
      proxePromise,
      sheetPromise,
    ]);

    // Log both outcomes so we can spot PROXe outages from console + analytics.
    if (!proxeOutcome.ok) {
      console.error(
        "[PAT] PROXe write failed:",
        proxeOutcome.errorMsg,
        sheetOutcome.ok
          ? "(saved to sheet backup)"
          : "(sheet backup ALSO failed)"
      );
    }
    if (!sheetOutcome.ok) {
      console.error(
        "[PAT] Sheet backup failed",
        proxeOutcome.ok ? "(saved to PROXe)" : "(PROXe ALSO failed)"
      );
    }

    // If BOTH writes failed, we genuinely lost the lead — block the user so
    // they can retry. Otherwise let them through to /thank-you.
    if (!proxeOutcome.ok && !sheetOutcome.ok) {
      console.error("Assessment submission failed: both writes failed");
      setError({
        message:
          "We could not save your assessment just now. Please check your connection and try again.",
      });
      setPhase("error");
      return;
    }

    // PROXe is the system of record now; the proxy does not return scores
    // back to the client. Fall back to the local preview.
    try {
      const finalScores = preview.subScores;
      const finalTotal = preview.total;
      const finalTier = preview.tier;

      trackFormSubmission(
        "assessment",
        {
          name: `${snapshot.identity.firstName ?? ""} ${snapshot.identity.lastName ?? ""}`.trim(),
          email: snapshot.identity.email,
          phone: snapshot.identity.phone,
          score: finalTotal,
          tier: finalTier,
        },
        sourceFrom || undefined
      );

      trackPilotLead(sourceFrom || "unknown", "assessment_completion");
      recordAssessmentSession(answersForScoring, finalTotal, finalTier);

      saveUserSessionData({
        firstName: snapshot.identity.firstName,
        lastName: snapshot.identity.lastName,
        email: snapshot.identity.email,
        phone: snapshot.identity.phone,
        city: snapshot.identity.city,
        interest: sourceFrom || undefined,
        assessmentScore: finalTotal,
        tier: finalTier,
      });
      markAssessmentCompleted();
      clearProgress();

      const data = encodeURIComponent(
        JSON.stringify({
          score: finalTotal,
          tier: finalTier,
          qualificationScore: finalScores.qualification,
          aptitudeScore: finalScores.aptitude,
          readinessScore: finalScores.readiness,
          audience: "student",
          name: snapshot.identity.firstName,
        })
      );
      window.location.href = `/thank-you?type=assessment&data=${data}`;
    } catch (err) {
      // Lead is already saved at this point (we returned early above if both
      // writes failed). This catch is for analytics tracking / redirect
      // hiccups — the user still has their score, we just couldn't move them.
      console.error("Assessment post-save error:", err);
      setError({
        message:
          "Your assessment was saved. We hit a snag showing your results — please try again.",
      });
      setPhase("error");
    }
  }

  // ---- Render ---------------------------------------------------------------
  if (phase === "loading") {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-10 h-10 border-2 border-[#C5A572]/40 border-t-[#C5A572] rounded-full animate-spin" />
      </div>
    );
  }

  if (phase === "resume_prompt") {
    const answeredCount = Object.values(progress.answersById).filter(
      (v) => v !== "" && v !== null && v !== undefined
    ).length;
    return (
      <ResumePrompt
        questionsAnswered={answeredCount}
        totalQuestions={PAT_QUESTION_COUNT}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
    );
  }

  if (phase === "gate") {
    return <EligibilityGate onAnswer={handleGateAnswer} />;
  }

  if (phase === "identity_mini") {
    return (
      <IdentityCapture
        mode="mini"
        initial={progress.identity}
        onSubmit={handleIdentityMiniSubmit}
      />
    );
  }

  if (phase === "identity_full") {
    return (
      <IdentityCapture
        mode="full"
        initial={progress.identity}
        onSubmit={handleIdentityFullSubmit}
      />
    );
  }

  if (phase === "submitting") {
    return <SubmittingState />;
  }

  if (phase === "error") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-[#1A1A1A] border-t-2 border-red-500 rounded-xl p-8">
          <div className="absolute -top-3 left-6">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Submission failed
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2 mb-3">
            Something went wrong.
          </h2>
          <p className="text-white/70 mb-6">
            {error?.message ??
              "We could not save your assessment. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setPhase("identity_full");
            }}
            className="bg-[#C5A572] text-[#1A1A1A] px-6 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // phase === "questions"
  if (!currentQuestion) {
    return null;
  }

  return (
    <QuestionScreen
      question={currentQuestion}
      currentIndex={progress.currentQuestionIndex}
      totalCount={PAT_QUESTION_COUNT}
      sectionHeader={sectionHeader}
      currentValue={currentValue}
      onAnswer={handleAnswer}
      onBack={goBack}
      onNext={() => goNext()}
      isLast={isLast}
      canProceed={canProceed}
    />
  );
}
