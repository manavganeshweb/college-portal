import StudyAbroadCard from "./StudyAbroadCard";
import TopCoursesCard from "./TopCoursesCard";
import ExpertCounsellingCard from "./ExpertCounsellingCard";

type CoursePreview = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type HomeDiscoveryCardsProps = {
  courses: CoursePreview[];
};

export default function HomeDiscoveryCards({
  courses,
}: HomeDiscoveryCardsProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_1fr_1.08fr]">
          <StudyAbroadCard />

          <TopCoursesCard courses={courses} />

          <ExpertCounsellingCard />
        </div>
      </div>
    </section>
  );
}