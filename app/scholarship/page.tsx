import type { Metadata } from "next";
import Link from "next/link";
import { SCHOLARSHIP_FORMS } from "@/lib/scholarship-forms";
import { WINGS_SCHOLARSHIP_TRACKS, WINGS_SCHOLARSHIP_NAME } from "@/lib/wings-of-freedom";

/**
 * Track chooser - the landing spot for the "Apply for scholarship" button.
 *
 * The WhatsApp campaign goes to every registrant with one message and one
 * link, so the track cannot be baked into the URL: most registrants never
 * told us whether they want Pilot or Cabin Crew, and guessing would hand a
 * cabin crew applicant the pilot paper. They pick here instead, which is one
 * tap and always right.
 */

export const metadata: Metadata = {
  title: `${WINGS_SCHOLARSHIP_NAME} Scholarship | WindChasers`,
  description: "Choose your track and start your scholarship application.",
  robots: { index: false, follow: false },
};

export default function ScholarshipChooserPage({
  searchParams,
}: {
  searchParams?: { p?: string; n?: string };
}) {
  // Carry name and phone through if the link had them, so someone arriving
  // from the registration modal isn't retyping what we already know.
  const qs = new URLSearchParams();
  if (searchParams?.p) qs.set("p", searchParams.p);
  if (searchParams?.n) qs.set("n", searchParams.n);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  return (
    <main className="min-h-screen bg-[#141417] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5A572]">
          {WINGS_SCHOLARSHIP_NAME} Scholarship
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          Which one are you applying for?
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
          The two programmes are assessed separately, so the application is different for each.
          Pick yours and you will go straight to the right form.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {WINGS_SCHOLARSHIP_TRACKS.map((track) => {
            const form = SCHOLARSHIP_FORMS[track.applicationPath.split("/").pop() || ""];
            return (
              <Link
                key={track.id}
                href={`${track.applicationPath}${suffix}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C5A572]/60 hover:bg-[#C5A572]/[0.06]"
              >
                <span className="text-lg font-semibold text-white">{track.label}</span>
                <span className="mt-1 text-[12.5px] text-white/50">
                  Towards {track.towards}
                </span>
                {form?.processNote ? (
                  <span className="mt-3 text-[11.5px] leading-relaxed text-white/40">
                    {form.processNote.split(".")[0]}.
                  </span>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C5A572]">
                  Start application
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Applying is not winning. Said here as well as in the form, because
            this page is where most people arrive from the message. */}
        <p className="mt-8 text-[12px] leading-relaxed text-white/40">
          Applying does not decide the scholarship. An assessment and a personal interview follow,
          and selection is merit based.
        </p>
      </div>
    </main>
  );
}
