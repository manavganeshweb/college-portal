import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://collegeaadhar.com"),

  title: {
    default: "College Aadhar | Find the Right College",
    template: "%s | College Aadhar",
  },

  description:
    "College Aadhar helps students discover colleges, courses, exams, scholarships and education opportunities.",

  keywords: [
    "colleges",
    "courses",
    "college predictor",
    "rank predictor",
    "scholarships",
    "college admissions",
    "education",
  ],

  openGraph: {
    title: "College Aadhar",
    description:
      "Discover, compare and choose the right college for your future.",
    type: "website",
    siteName: "College Aadhar",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}