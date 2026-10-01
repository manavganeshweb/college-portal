import type { Metadata } from "next";

import StudyAbroadHero from "../components/public/study-abroad/StudyAbroadHero";
import StudyAbroadFeatures from "../components/public/study-abroad/StudyAbroadFeatures";
import StudyAbroadSteps from "../components/public/study-abroad/StudyAbroadSteps";
import StudyAbroadCTA from "../components/public/study-abroad/StudyAbroadCTA";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Study Abroad | College Aadhar",
  description:
    "Explore international education opportunities, understand study options and plan your study abroad journey with College Aadhar.",
  alternates: {
    canonical: "/study-abroad",
  },
  openGraph: {
    title: "Study Abroad | College Aadhar",
    description:
      "Explore international education opportunities and plan your study abroad journey.",
    url: "/study-abroad",
    type: "website",
  },
};

export default function StudyAbroadPage() {
  return (
    <main className="bg-white">
      <StudyAbroadHero />
      <StudyAbroadFeatures />
      <StudyAbroadSteps />
      <StudyAbroadCTA />
    </main>
  );
}