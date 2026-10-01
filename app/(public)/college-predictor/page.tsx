import type { Metadata } from "next";

import CollegePredictorHero from "../components/public/college-predictor/CollegePredictorHero";
import CollegePredictorForm from "../components/public/college-predictor/CollegePredictorForm";
import PredictorInfo from "../components/public/college-predictor/PredictorInfo";
import { getPredictorExams } from "@/services/predictor.service";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "College Predictor | College Aadhar",
  description:
    "Predict colleges based on your entrance exam rank, category and available cutoff data.",
  alternates: {
    canonical: "/college-predictor",
  },
  openGraph: {
    title: "College Predictor | College Aadhar",
    description:
      "Find colleges matching your entrance exam rank and category.",
    url: "/college-predictor",
    type: "website",
  },
};

export default async function CollegePredictorPage() {
  const exams = await getPredictorExams();

  return (
    <main className="bg-white">
      <CollegePredictorHero />

      <CollegePredictorForm exams={exams} />

      <PredictorInfo />
    </main>
  );
}