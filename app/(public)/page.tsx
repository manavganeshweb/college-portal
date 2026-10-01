import HomeDiscoveryCards from "./components/public/home/HomeDiscoveryCards";
import HomeFeatureStrip from "./components/public/home/HomeFeatureStrip";
import HomeHero from "./components/public/home/HomeHero";
import PopularColleges from "./components/public/home/PopularColleges";
import TopTenColleges from "./components/public/home/TopTenColleges";
import TrustStats from "./components/public/home/TrustStats";
import { getHomepageCourses } from "@/services/home.service";
import CollegeRankingSection from "./components/public/home/CollegeRankingSection";
import TopStudyPlaces from "./components/public/home/TopStudyPlaces";
import BoardExamSection from "./components/public/home/BoardExamSection";
import LatestNews from "./components/public/home/LatestNews";
export default async function HomePage() {
  const courses = await getHomepageCourses(3);

  return (
    <main className="bg-white">
      <HomeHero />

      <HomeFeatureStrip />

      <PopularColleges />

          <TopStudyPlaces />

      <TopTenColleges />

            <CollegeRankingSection />

    <BoardExamSection />
    <LatestNews />
      <HomeDiscoveryCards courses={courses} />

      <TrustStats />
    </main>
  );
}