import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/ielts-training-program";

export const metadata = {
  title: "IELTS Training Program | WindChasers Aviation Academy",
  description:
    "IELTS coaching in Bangalore for aspiring pilots and students heading abroad. Specialised, personalised training to build the English proficiency international aviation careers require.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
