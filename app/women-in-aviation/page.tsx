import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/women-in-aviation";

export const metadata = {
  title: "Women in Aviation | WindChasers Aviation Academy",
  description:
    "WindChasers hosted India's first aviation event dedicated exclusively to aspiring female pilots, mentorship from aviation leaders, inspiring journeys, and career guidance for women in aviation. Bengaluru, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="women-in-aviation" />;
}
