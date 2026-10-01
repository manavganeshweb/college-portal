import Header from "../(public)/components/layout/Header";
import Footer from "../(public)/components/layout/Footer";
import CompareBar from "../(public)/components/public/CompareBar";
import CourseCompareBar from "../(public)/components/public/CourseCompareBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <CompareBar />
      <CourseCompareBar />

      <Footer />
    </>
  );
}