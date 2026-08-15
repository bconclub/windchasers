// Shared database and RPC payload types. Everything is explicit, no any.

export type UserRole = "admin" | "instructor" | "student";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionStatus = "draft" | "active" | "archived";
export type ExamType = "practice" | "mock" | "assignment";
export type ExamStatus = "draft" | "published" | "closed";
export type AttemptStatus = "in_progress" | "submitted" | "auto_submitted" | "expired";
export type OptionLetter = "A" | "B" | "C" | "D";

export const OPTION_LETTERS: readonly OptionLetter[] = ["A", "B", "C", "D"] as const;

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BatchEnrollment {
  id: string;
  batch_id: string;
  student_id: string;
  enrolled_at: string;
}

export interface InstructorBatch {
  id: string;
  instructor_id: string;
  batch_id: string;
  assigned_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  order_index: number;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  subject_id: string;
  topic_id: string | null;
  stem: string;
  stem_hash: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionLetter;
  explanation: string | null;
  difficulty: QuestionDifficulty;
  image_url: string | null;
  source: string | null;
  status: QuestionStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionWithLabels extends Question {
  subjects: { name: string } | null;
  topics: { name: string } | null;
}

export interface Exam {
  id: string;
  title: string;
  description: string | null;
  type: ExamType;
  duration_minutes: number;
  total_marks: number;
  marks_per_question: number;
  negative_marks: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_result_immediately: boolean;
  allow_review: boolean;
  show_leaderboard: boolean;
  opens_at: string | null;
  closes_at: string | null;
  max_attempts: number;
  status: ExamStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExamRule {
  id: string;
  exam_id: string;
  subject_id: string;
  topic_id: string | null;
  difficulty: QuestionDifficulty | null;
  question_count: number;
}

export interface ExamAssignment {
  id: string;
  exam_id: string;
  batch_id: string | null;
  student_id: string | null;
  assigned_at: string;
}

export interface Attempt {
  id: string;
  exam_id: string;
  student_id: string;
  started_at: string;
  submitted_at: string | null;
  status: AttemptStatus;
  score: number | null;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  time_taken_seconds: number | null;
  tab_switch_count: number;
}

// ---------------------------------------------------------------------------
// RPC payloads
// ---------------------------------------------------------------------------

export interface RunnerQuestion {
  id: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  image_url: string | null;
  subject_id: string;
  subject_name: string;
  topic_id: string | null;
  topic_name: string | null;
  order_index: number;
}

export interface RunnerAnswer {
  question_id: string;
  selected_option: OptionLetter | null;
  marked_for_review: boolean;
  time_spent_seconds: number;
}

export interface StartAttemptPayload {
  attempt: {
    id: string;
    exam_id: string;
    started_at: string;
    status: AttemptStatus;
    tab_switch_count: number;
    deadline: string;
    server_now: string;
  };
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
    marks_per_question: number;
    negative_marks: number;
    shuffle_options: boolean;
    allow_review: boolean;
    show_result_immediately: boolean;
  };
  questions: RunnerQuestion[];
  answers: RunnerAnswer[];
}

export interface SubmitAttemptPayload {
  attempt_id: string;
  status: AttemptStatus;
  score: number | null;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  time_taken_seconds: number | null;
}

export interface SubjectBreakdown {
  subject_id: string;
  subject_name: string;
  total: number;
  correct: number;
  incorrect: number;
  unattempted: number;
}

export interface TopicBreakdown {
  topic_id: string;
  topic_name: string;
  subject_name: string;
  total: number;
  correct: number;
}

export interface ReviewQuestion extends RunnerQuestion {
  correct_option: OptionLetter;
  explanation: string | null;
  selected_option: OptionLetter | null;
  is_correct: boolean | null;
  marked_for_review: boolean;
  time_spent_seconds: number;
}

export interface AttemptResultPayload {
  attempt: {
    id: string;
    exam_id: string;
    status: AttemptStatus;
    started_at: string;
    submitted_at: string | null;
    score: number | null;
    total_questions: number;
    correct_count: number;
    incorrect_count: number;
    unattempted_count: number;
    time_taken_seconds: number | null;
    tab_switch_count: number;
  };
  exam: {
    id: string;
    title: string;
    type: ExamType;
    duration_minutes: number;
    total_marks: number;
    marks_per_question: number;
    negative_marks: number;
    allow_review: boolean;
    show_leaderboard: boolean;
  };
  // Average across the batches this student belongs to. Null when nobody in
  // the cohort has a graded attempt yet.
  batch_average: number | null;
  leaderboard: LeaderboardRow[];
  subject_breakdown: SubjectBreakdown[];
  topic_breakdown: TopicBreakdown[];
  can_review: boolean;
  questions: ReviewQuestion[];
}

export interface LeaderboardRow {
  student_name: string;
  score: number | null;
  time_taken_seconds: number | null;
  is_you: boolean;
  rank: number;
}

export interface DashboardExam {
  id: string;
  title: string;
  description: string | null;
  type: ExamType;
  duration_minutes: number;
  total_marks: number;
  opens_at: string | null;
  closes_at: string | null;
  max_attempts: number;
  attempts_used: number;
  in_progress_attempt_id: string | null;
  last_attempt_id: string | null;
  phase: "upcoming" | "live" | "closed";
}

export interface StudentDashboardPayload {
  exams: DashboardExam[];
  stats: {
    attempts: number;
    questions_answered: number;
    correct: number;
    accuracy: number;
    avg_score: number;
  };
  subject_accuracy: Array<{
    subject_id: string;
    subject_name: string;
    answered: number;
    correct: number;
    accuracy: number;
  }>;
  // Three weakest topics by name, each with at least three answered questions
  // behind it. Empty until the student has done enough practice to be fair.
  weak_topics: Array<{
    topic_id: string;
    topic_name: string;
    subject_name: string;
    answered: number;
    correct: number;
    accuracy: number;
  }>;
  recent_attempts: Array<{
    id: string;
    exam_title: string;
    score: number | null;
    total_marks: number;
    correct_count: number;
    total_questions: number;
    submitted_at: string | null;
    status: AttemptStatus;
  }>;
}

export interface AdminDashboardPayload {
  total_students: number;
  active_batches: number;
  total_questions: number;
  published_exams: number;
  attempts_this_week: number;
  questions_by_subject: Array<{
    subject_id: string;
    subject_name: string;
    total: number;
  }>;
  recent_attempts: Array<{
    id: string;
    student_name: string;
    exam_title: string;
    status: AttemptStatus;
    score: number | null;
    total_marks: number;
    started_at: string;
  }>;
}

export interface ExamAnalyticsPayload {
  exam: {
    id: string;
    title: string;
    total_marks: number;
    marks_per_question: number;
    negative_marks: number;
    duration_minutes: number;
    status: ExamStatus;
  } | null;
  summary: {
    attempts: number;
    avg_score: number;
    high_score: number;
    low_score: number;
    avg_time_seconds: number;
  };
  leaderboard: Array<{
    attempt_id: string;
    student_id: string;
    student_name: string;
    email: string;
    score: number | null;
    correct_count: number;
    incorrect_count: number;
    unattempted_count: number;
    time_taken_seconds: number | null;
    tab_switch_count: number;
    submitted_at: string | null;
    rank: number;
  }>;
  question_analytics: Array<{
    question_id: string;
    order_index: number;
    stem: string;
    correct_option: OptionLetter;
    attempted: number;
    correct: number;
    percent_correct: number;
    option_counts: Record<OptionLetter, number>;
  }>;
}

export interface StudentReportPayload {
  student: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    batches: Array<{ id: string; name: string; code: string }>;
  } | null;
  stats: { attempts: number; avg_score: number; accuracy: number };
  subject_accuracy: Array<{
    subject_name: string;
    answered: number;
    correct: number;
    accuracy: number;
  }>;
  attempts: Array<{
    id: string;
    exam_title: string;
    score: number | null;
    total_marks: number;
    correct_count: number;
    total_questions: number;
    status: AttemptStatus;
    submitted_at: string | null;
    time_taken_seconds: number | null;
  }>;
}

export interface BatchPerformancePayload {
  students: Array<{
    id: string;
    full_name: string;
    email: string;
    attempts: number;
    avg_score: number | null;
    accuracy: number | null;
  }>;
}

export interface PracticeQuestion {
  id: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  image_url: string | null;
  subject_name: string;
  topic_name: string | null;
  difficulty: QuestionDifficulty;
}

export interface PracticeCheckPayload {
  question_id: string;
  correct_option: OptionLetter;
  is_correct: boolean;
  explanation: string | null;
}

export interface StartPracticePayload {
  session_id: string;
  questions: PracticeQuestion[];
}

export interface FinishPracticePayload {
  session_id: string;
  question_count: number;
  answered_count: number;
  correct_count: number;
  accuracy: number;
}

// Practice is stored apart from attempts so it never enters exam reporting.
export interface PracticeSession {
  id: string;
  student_id: string;
  subject_id: string | null;
  topic_id: string | null;
  difficulty: QuestionDifficulty | null;
  question_count: number;
  answered_count: number;
  correct_count: number;
  started_at: string;
  ended_at: string | null;
}

export interface BatchComparisonRow {
  batch_id: string;
  name: string;
  code: string;
  is_active: boolean;
  student_count: number;
  attempts: number;
  avg_score: number | null;
  accuracy: number | null;
}

// ---------------------------------------------------------------------------
// Import types
// ---------------------------------------------------------------------------

export interface ImportRow {
  rowNumber: number;
  subject: string;
  topic: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  errors: string[];
  duplicate: boolean;
}

export interface ImportResult {
  inserted: number;
  skipped: number;
  createdSubjects: string[];
  createdTopics: string[];
  duplicates: number;
}
