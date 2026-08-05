/**
 * Wind Chasers Full Scholarship application forms.
 *
 * TRANSCRIBED VERBATIM from the academy's own PDFs. Nothing here is invented,
 * reworded or reordered - if a label reads oddly, it reads that way on the
 * form. Two separate documents, two genuinely different forms:
 *
 *   pilot       "Windchasers_ scholarship form.pdf"
 *               DGCA Ground School Scholarship Selection
 *   cabin_crew  "Wind_Chasers_Full_Scholarship_Application_Form_Spaced.pdf"
 *               Full Scholarship Application Form - Cabin Crew Training
 *
 * They diverge in both fields and questions: pilot asks for DGCA exams cleared,
 * cabin crew asks for height and weight. Only 3 of the 8 essay questions
 * overlap in intent, and none in wording. Do not merge them.
 *
 * The wider process lives in "Windchasers selection process.pdf": this form is
 * Stage 1, worth 20 of 100 marks. Stage 2 is a 45-minute, 40-mark aptitude test
 * and Stage 3 is a 40-mark interview. Stage 1 carries essays, so its 20 marks
 * are awarded by staff, not computed here.
 */

export type ScholarshipTrack = "pilot" | "cabin_crew";

export type FieldType = "text" | "tel" | "email" | "date" | "number" | "textarea" | "select";

export interface ScholarshipField {
  /** Submitted key. Prefixed on the wire so PROXe can group them. */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  /** Suffix shown inside the field, e.g. "cm". */
  suffix?: string;
  /** Half-width on desktop, so paired fields sit on one row like the paper form. */
  half?: boolean;
}

export interface ScholarshipQuestion {
  name: string;
  /** The question exactly as printed. */
  question: string;
  /** Word guidance where the form states one. */
  hint?: string;
  required?: boolean;
}

export interface ScholarshipFormConfig {
  track: ScholarshipTrack;
  slug: string;
  /** Title as printed on the form. */
  title: string;
  academy: string;
  /** What this form is Stage 1 of. */
  processNote: string;
  sections: { heading: string; fields: ScholarshipField[] }[];
  questions: ScholarshipQuestion[];
  /** The declaration text, verbatim. Stored with the submission. */
  declaration: string;
  /** Hard eligibility gate on one of the fields above. Both scholarships run
   *  under Wings of Freedom, a women-only cohort, so an applicant who answers
   *  Gender with anything but Female is stopped at that step rather than
   *  writing eight essays for an application that cannot be considered. The
   *  Gender field itself stays as the PDF prints it. */
  eligibility?: {
    field: string;
    allowed: string[];
    /** Shown in place of the step's continue button. Say why, not just no. */
    message: string;
  };
}

/** Both tracks are awarded under the women-only Wings of Freedom programme. */
const WOMEN_ONLY: NonNullable<ScholarshipFormConfig["eligibility"]> = {
  field: "gender",
  allowed: ["Female"],
  message:
    "This scholarship is part of Wings of Freedom, a women-only programme, so we can only consider applications from women. Our other courses are open to everyone - talk to us on WhatsApp and we will take you through them.",
};

const ACADEMY = "Wind Chasers Aviation Academy";

/** Shared only where the two PDFs genuinely print identical labels. */
const PASSPORT_OPTIONS = ["Yes", "No", "Applied"];
const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"];

export const PILOT_FORM: ScholarshipFormConfig = {
  track: "pilot",
  slug: "pilot",
  title: "DGCA Ground School Scholarship Selection",
  academy: ACADEMY,
  processNote:
    "This is Stage 1 of 3. It carries 20 of the scholarship's 100 marks, followed by a 45-minute aptitude test (40 marks) and a personal interview (40 marks).",
  sections: [
    {
      heading: "Your details",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, half: true },
        { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS, required: true, half: true },
        { name: "mobile", label: "Mobile", type: "tel", required: true, half: true },
        { name: "email", label: "Email", type: "email", required: true, half: true },
        { name: "address", label: "Address", type: "textarea", required: true },
      ],
    },
    {
      heading: "Qualification",
      fields: [
        { name: "highest_qualification", label: "Highest Qualification", type: "text", required: true },
        {
          name: "dgca_exams_cleared",
          label: "DGCA exams cleared (if any)",
          type: "text",
          placeholder: "Leave blank if none",
        },
        { name: "passport", label: "Passport", type: "select", options: PASSPORT_OPTIONS, required: true },
      ],
    },
    {
      heading: "Family",
      fields: [
        { name: "father_name", label: "Father's Name", type: "text", required: true, half: true },
        { name: "father_occupation", label: "Occupation", type: "text", required: true, half: true },
        { name: "mother_name", label: "Mother's Name", type: "text", required: true, half: true },
        { name: "mother_occupation", label: "Occupation", type: "text", required: true, half: true },
        { name: "monthly_family_income", label: "Monthly Family Income", type: "text", required: true },
      ],
    },
  ],
  questions: [
    { name: "q1_why_pilot", question: "Why do you want to become a Commercial Pilot?", required: true },
    { name: "q2_why_applying", question: "Why are you applying for the Wind Chasers Pilot Ground School Scholarship?", required: true },
    { name: "q3_why_award", question: "Why should Wind Chasers Aviation Academy award you this scholarship?", required: true },
    { name: "q4_challenges", question: "What challenges have you faced in pursuing your dream of becoming a pilot?", required: true },
    {
      name: "q5_steps_taken",
      question: "What steps have you already taken toward becoming a pilot?",
      hint: "DGCA exams, flying experience, aviation courses, self-study, etc.",
      required: true,
    },
    { name: "q6_how_helps", question: "How will receiving this scholarship help you achieve your aviation career?", required: true },
    {
      name: "q7_achievements",
      question: "Mention any academic achievements, leadership roles, sports, volunteering, or extracurricular activities.",
      required: true,
    },
    {
      name: "q8_deserve",
      question: "Explain why you deserve this scholarship and how you plan to make the most of this opportunity.",
      hint: "In approximately 200 words.",
      required: true,
    },
  ],
  declaration:
    "I declare that all the information provided in this application is true and correct to the best of my knowledge. I understand that providing false information may result in cancellation of my scholarship application.",
  eligibility: WOMEN_ONLY,
};

export const CABIN_CREW_FORM: ScholarshipFormConfig = {
  track: "cabin_crew",
  slug: "cabin-crew",
  title: "Full Scholarship Application Form - Cabin Crew Training",
  academy: ACADEMY,
  processNote:
    "This is Stage 1 of 4: application screening, then a grooming and communication assessment, a written assessment, and a personal interview.",
  sections: [
    {
      heading: "Your details",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true },
        { name: "date_of_birth", label: "Date of Birth", type: "date", required: true, half: true },
        { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS, required: true, half: true },
        { name: "mobile", label: "Mobile", type: "tel", required: true, half: true },
        { name: "email", label: "Email", type: "email", required: true, half: true },
        { name: "address", label: "Address", type: "textarea", required: true },
      ],
    },
    {
      heading: "Qualification",
      fields: [
        { name: "highest_qualification", label: "Highest Qualification", type: "text", required: true },
        { name: "height_cm", label: "Height", type: "number", suffix: "cm", required: true, half: true },
        { name: "weight_kg", label: "Weight", type: "number", suffix: "kg", required: true, half: true },
        { name: "passport", label: "Passport", type: "select", options: PASSPORT_OPTIONS, required: true },
      ],
    },
    {
      heading: "Family",
      fields: [
        { name: "father_name", label: "Father's Name", type: "text", required: true, half: true },
        { name: "father_occupation", label: "Occupation", type: "text", required: true, half: true },
        { name: "mother_name", label: "Mother's Name", type: "text", required: true, half: true },
        { name: "mother_occupation", label: "Occupation", type: "text", required: true, half: true },
        { name: "monthly_family_income", label: "Monthly Family Income", type: "text", required: true },
      ],
    },
  ],
  questions: [
    { name: "q1_why_cabin_crew", question: "Why do you want to become a Cabin Crew?", required: true },
    { name: "q2_why_award", question: "Why should Wind Chasers Aviation Academy award you the Full Scholarship?", required: true },
    { name: "q3_different", question: "What makes you different from other applicants?", required: true },
    { name: "q4_challenge", question: "Describe the biggest challenge you have faced and how you overcame it.", required: true },
    { name: "q5_family_future", question: "How will becoming Cabin Crew change your family's future?", required: true },
    { name: "q6_career_goals", question: "What are your career goals in the next five years?", required: true },
    { name: "q7_achievements", question: "Mention any leadership, sports, volunteering or cultural achievements.", required: true },
    {
      name: "q8_deserve",
      question: "Explain why you deserve this scholarship.",
      hint: "In about 150 words.",
      required: true,
    },
  ],
  declaration: "I declare that the information provided is true and correct.",
  eligibility: WOMEN_ONLY,
};

export const SCHOLARSHIP_FORMS: Record<string, ScholarshipFormConfig> = {
  pilot: PILOT_FORM,
  "cabin-crew": CABIN_CREW_FORM,
};

export function getScholarshipForm(slug: string): ScholarshipFormConfig | null {
  return SCHOLARSHIP_FORMS[slug] ?? null;
}
