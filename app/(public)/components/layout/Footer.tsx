import Link from "next/link";
import {
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import Container from "../ui/Container";

const columns = [
  {
    title: "Explore",
    links: [
      ["Colleges", "/colleges"],
      ["Courses", "/courses"],
      ["Exams", "/exams"],
      ["Compare Colleges", "/compare"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["College Predictor", "/college-predictor"],
      ["Rank Predictor", "/rank-predictor"],
      ["Scholarships", "/scholarships"],
      ["Study Abroad", "/study-abroad"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Articles", "/articles"],
      ["News", "/news"],
      ["Q&A", "/qna"],
      ["Counselling", "/counselling"],
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    label: "X",
    icon: FaXTwitter,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <GraduationCap size={22} />
              </div>

              <span className="text-xl font-extrabold">
                College <span className="text-green-400">Aadhar</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Discover the right college, course and career path with
              trusted education information and smart discovery tools.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition-all duration-200 hover:border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold text-white">
                {column.title}
              </h3>

              <div className="mt-5 space-y-3">
                {column.links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition hover:text-green-400"
                  >
                    {label}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-gray-800 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 College Aadhar. All rights reserved.</p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}