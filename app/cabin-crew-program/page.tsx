import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/cabin-crew-program";

export const metadata = {
  title: "Cabin Crew Program | WindChasers Aviation Academy",
  description:
    "Launch a cabin crew career with WindChasers. Affordable, job-ready training covering safety, customer service, mock flights, and airline interview prep — with placement assistance. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
