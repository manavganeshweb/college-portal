import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Waypoints,
  Eye,
  Lightbulb,
  Quote,
  Building2,
  ClipboardCheck,
  Globe2,
  TrendingUp,
  Laptop,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "About College Aadhar | Educational Consultancy & College Admission Guidance in Delhi",
  description:
    "College Aadhar is a Delhi-based educational consultancy helping students choose the right college, course, and career with expert counselling. 10,000+ students counselled.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title:
      "About College Aadhar | Educational Consultancy & College Admission Guidance",
    description:
      "Discover the story, mission, and vision behind College Aadhar. We're helping students explore colleges, courses, and career opportunities.",
    url: "/about",
    siteName: "College Aadhar",
    type: "website",
  },
};

const services = [
  {
    number: "01",
    icon: Building2,
    title: "Explore Colleges",
    description:
      "Discover colleges and universities across India. Explore courses, fees, locations, facilities, and other important details to narrow down your options.",
    href: "/colleges",
    linkLabel: "Explore colleges",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Find Your Course",
    description:
      "Explore undergraduate, postgraduate, diploma, and other programs to understand your options and find a course aligned with your interests.",
    href: "/courses",
    linkLabel: "Browse courses",
  },
  {
    number: "03",
    icon: Target,
    title: "Predict Your College",
    description:
      "Explore college prediction resources to understand potential options based on your entrance exam, rank, and available information.",
    href: "/college-predictor",
    linkLabel: "Try college predictor",
  },
  {
    number: "04",
    icon: Waypoints,
    title: "Compare Colleges",
    description:
      "Compare colleges side by side to evaluate fees, courses, rankings, and other details that matter to your academic plans.",
    href: "/compare",
    linkLabel: "Compare colleges",
  },
  {
    number: "05",
    icon: ClipboardCheck,
    title: "Understand Admissions",
    description:
      "Research admission requirements, entrance exams, cutoffs, important dates, and other details to prepare for the application process.",
    href: "/exams",
    linkLabel: "Explore exams",
  },
  {
    number: "06",
    icon: Globe2,
    title: "Explore Study Abroad",
    description:
      "Start researching international education opportunities and explore options for taking your academic journey beyond India.",
    href: "/study-abroad",
    linkLabel: "Explore study abroad",
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Accuracy matters",
    description:
      "We aim to provide useful, reliable college information and encourage students to verify important admission details with official university sources.",
  },
  {
    icon: HeartHandshake,
    title: "Students come first",
    description:
      "Every student's circumstances, interests, budget, and goals are different. We believe guidance should respect those differences.",
  },
  {
    icon: Lightbulb,
    title: "Clarity over confusion",
    description:
      "We organize educational information to make researching colleges and courses easier to understand.",
  },
  {
    icon: TrendingUp,
    title: "Always improving",
    description:
      "We want to keep learning, improve our platform, correct mistakes, and make the college discovery experience better over time.",
  },
];

const stats = [
  {
    value: "10,000+",
    label: "Students counselled",
    icon: Users,
  },
  {
    value: "1,000+",
    label: "Students guided toward university choices",
    icon: GraduationCap,
  },
  {
    value: "500+",
    label: "Colleges to explore",
    icon: Building2,
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f4faf6]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#15945c]/10 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[400px] w-[400px] rounded-full bg-emerald-200/30 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(#15945c 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-10 lg:py-28">
          <div className="animate-[fadeInUp_0.65s_ease-out_both]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#15945c]/15 bg-white px-4 py-2 text-sm font-semibold text-[#15945c] shadow-sm">
              <Sparkles className="h-4 w-4" />
              About College Aadhar
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[64px]">
              Your future deserves{" "}
              <span className="relative inline-block text-[#15945c]">
                a clear direction.
                <svg
                  viewBox="0 0 320 14"
                  fill="none"
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 w-full"
                >
                  <path
                    d="M4 9C76 2 191 2 316 8"
                    stroke="#15945c"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Choosing a college is one of the biggest decisions of your
              life. College Aadhar helps students and parents explore
              colleges, understand courses, research admissions, and make
              more informed decisions about the future.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/colleges"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#15945c]/15 transition hover:-translate-y-0.5 hover:bg-[#117b4b]"
              >
                Explore colleges
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#15945c]/40 hover:text-[#15945c]"
              >
                Discover courses
                <ArrowDownRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#15945c]" />
                Explore your options
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#15945c]" />
                Make informed choices
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-[510px] animate-[fadeInUp_0.8s_ease-out_both] lg:ml-auto">
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-3xl border border-[#15945c]/15 bg-[#15945c]/5 sm:-right-7 sm:-top-7" />

            <div className="relative overflow-hidden rounded-[30px] border border-white bg-white p-5 shadow-[0_25px_90px_-35px_rgba(21,148,92,0.28)] sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15945c]">
                    Your journey
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    Start with clarity.
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#15945c]/10 text-[#15945c]">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4 py-6">
                {[
                  {
                    icon: Search,
                    title: "Discover your options",
                    text: "Explore colleges and courses.",
                  },
                  {
                    icon: Compass,
                    title: "Understand your path",
                    text: "Research eligibility, fees, and admissions.",
                  },
                  {
                    icon: Target,
                    title: "Choose with confidence",
                    text: "Compare options against your goals.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#15945c]/20 hover:bg-[#f6fbf8]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c] transition group-hover:bg-[#15945c] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold tracking-wider text-[#15945c]">
                            0{index + 1}
                          </span>

                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                          {item.text}
                        </p>
                      </div>

                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#15945c]/60" />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#15945c] p-4 text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <HeartHandshake className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Your goals. Your choices.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/80">
                    We&apos;re here to help you explore them.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Lightbulb className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Every question matters.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Every student deserves clarity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY INTRODUCTION */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              Who we are
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              A foundation for your educational journey.
            </h2>

            <div className="mt-6 h-1 w-16 rounded-full bg-[#15945c]" />
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
            <p>
              College Aadhar is an educational consultancy and college
              discovery platform built around a simple belief: students
              deserve clear information when making important decisions
              about their future.
            </p>

            <p>
              We bring together college information, courses, fees,
              admission details, entrance exams, and educational resources
              to make researching higher education more straightforward.
            </p>

            <p>
              Whether you are deciding what to study, comparing
              universities, or preparing for an entrance exam, our goal
              is to help you understand your options and take your next
              step with greater confidence.
            </p>
          </div>
        </div>
      </section>

      {/* THE MEANING OF AADHAR */}
      <section className="border-y border-slate-100 bg-[#f8faf9]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-20 w-20 rounded-3xl bg-[#15945c]/10" />

            <div className="relative rounded-[28px] border border-slate-100 bg-white p-7 shadow-sm sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15945c]/10 text-[#15945c]">
                <HeartHandshake className="h-7 w-7" />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#15945c]">
                The meaning behind our name
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Aadhar
              </h2>

              <p className="mt-3 text-xl font-medium text-slate-500">
                A foundation you can build on.
              </p>

              <div className="mt-7 h-px bg-slate-100" />

              <p className="mt-6 text-base leading-8 text-slate-600">
                A strong foundation makes it easier to move forward. We
                want College Aadhar to be a starting point students can
                rely on while exploring their educational possibilities.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              Why College Aadhar?
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Because your starting point shouldn&apos;t determine your
              possibilities.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              Some students have family members, teachers, or mentors who
              can help them understand college admissions. Others have to
              figure everything out on their own.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              We want useful educational information to be easier to
              discover, whether a student lives in a major city or a
              small town, has already chosen a career or is still
              exploring possibilities.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Our name reflects the role we hope to play: a foundation
              that helps students make sense of their options and build
              their next steps on a better understanding.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
            What drives us
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            A clearer path to higher education.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Our mission and vision guide how we think about students,
            educational information, and the future we want to help build.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="group relative overflow-hidden rounded-[28px] bg-[#15945c] p-7 text-white sm:p-10">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-white/[0.07] transition-transform duration-500 group-hover:scale-110" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Target className="h-7 w-7" />
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                Our mission
              </p>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Make choosing a college simpler.
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                Our mission is to become a leading educational consultancy
                by making college selection simpler, more transparent, and
                less stressful. We aim to bring colleges, courses, fees,
                and entrance exam information together in a way students
                and parents can understand.
              </p>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-[#f7faf8] p-7 sm:p-10">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-[#15945c]/[0.06] transition-transform duration-500 group-hover:scale-110" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15945c]/10 text-[#15945c]">
                <Eye className="h-7 w-7" />
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-[#15945c]">
                Our vision
              </p>

              <h3 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                An informed choice for every student.
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                We envision an India where no student has to choose a
                college out of confusion or fear, and where every student
                can say, &ldquo;I chose this because I understood my
                options.&rdquo;
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-[#f8faf9]">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              How it started
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Our story begins with a question.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              What if finding the right college didn&apos;t have to be
              so confusing?
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
            <div className="relative overflow-hidden rounded-[28px] bg-[#15945c] p-7 text-white sm:p-9">
              <Quote className="h-9 w-9 text-white/60" />

              <p className="mt-6 text-2xl font-semibold leading-relaxed sm:text-3xl">
                Every student deserves someone to turn to when the next
                step feels uncertain.
              </p>

              <div className="mt-8 h-px bg-white/20" />

              <p className="mt-5 text-sm leading-7 text-white/80">
                This belief is at the heart of why College Aadhar exists.
              </p>

              <GraduationCap className="absolute -bottom-7 -right-5 h-32 w-32 text-white/[0.08]" />
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>
                College Aadhar began with something its founder, Amandeep,
                noticed repeatedly while studying and working in the
                educational consultancy space.
              </p>

              <p>
                Students often struggled to find clear information about
                courses, colleges, universities, and admission processes.
                Those with experienced family members or mentors could
                ask for help. Others were left searching across different
                sources, trying to make sense of conflicting information.
              </p>

              <p>
                Choosing a course or college can influence several years
                of a student&apos;s life. We believe that decision deserves
                careful research and understandable information rather
                than guesswork.
              </p>

              <p>
                In 2026, Amandeep started College Aadhar with the aim of
                making college discovery and admission guidance easier
                to access, so that finding direction depends less on who
                you know and more on the information available to you.
              </p>

              <p>
                Today, the platform brings educational discovery tools
                and college information together, with the goal of
                continuing to make the process clearer for students and
                parents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-3xl bg-[#15945c]/10" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-[#f4faf6] p-7 sm:p-9">
              <div className="flex min-h-[290px] flex-col items-center justify-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#15945c] text-white shadow-lg shadow-[#15945c]/20">
                  <GraduationCap className="h-12 w-12" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#15945c]">
                  Founder
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-950">
                  Amandeep
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Education • Technology • Guidance
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["B.Tech", "Development", "Education"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#15945c]/15 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-3xl border border-[#15945c]/15 bg-white" />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              The person behind the platform
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Meet Amandeep, the founder of College Aadhar.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              Amandeep brings together an interest in technology and
              experience in educational consultancy. With a B.Tech
              background and experience in software development, he
              understands the importance of building tools that make
              information easier to access and use.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              His experience in education also exposed him to the
              questions students face while choosing courses and
              universities. That combination helped shape the idea
              behind College Aadhar: a platform that pairs useful
              technology with a practical understanding of student needs.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              The goal is straightforward—to help students find
              information, explore alternatives, and approach important
              educational decisions with greater clarity.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#15945c]/15 bg-[#f4faf6] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
                <Laptop className="h-5 w-5" />
              </div>

              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">
                  Technology meets guidance.
                </span>{" "}
                Building a more accessible way to explore education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="border-y border-slate-100 bg-[#f8faf9]">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              Working together
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Different skills. One shared purpose.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Building a useful educational platform requires more than
              technology. It takes thoughtful research, clear
              communication, good design, and an understanding of
              students&apos; needs.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              College Aadhar aims to bring these skills together to make
              educational information more approachable and useful.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Laptop,
                title: "Developers",
                text: "Building and improving the platform and its tools.",
              },
              {
                icon: Sparkles,
                title: "Designers & creatives",
                text: "Making information easier to navigate and understand.",
              },
              {
                icon: Search,
                title: "Writers & researchers",
                text: "Organizing educational information for students.",
              },
              {
                icon: MessageCircle,
                title: "Education consultants",
                text: "Helping students understand their choices and questions.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-1 hover:border-[#15945c]/20 hover:shadow-lg hover:shadow-slate-900/[0.03]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="relative overflow-hidden rounded-[30px] bg-[#15945c] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/[0.07]" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/[0.05] blur-2xl" />

          <div className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
                The impact we strive for
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Behind every number is a student with a future to build.
              </h2>

              <p className="mt-4 leading-7 text-white/80">
                Our work is about more than browsing colleges. It is
                about helping students find information that supports
                their next decision.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/[0.08] p-6 text-center backdrop-blur-sm"
                  >
                    <Icon className="mx-auto h-6 w-6 text-white/80" />

                    <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                      {stat.value}
                    </p>

                    <p className="mx-auto mt-2 max-w-[210px] text-sm leading-6 text-white/80">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="relative mt-6 text-center text-xs leading-5 text-white/70">
              These figures reflect the information supplied for this
              page. Please ensure they are current and verifiable before
              publishing.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-[#f8faf9]">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
                Explore College Aadhar
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything starts with exploring your options.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                From discovering colleges to researching entrance exams,
                explore the resources available on College Aadhar.
              </p>
            </div>

            <Link
              href="/colleges"
              className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-[#15945c] transition hover:gap-3"
            >
              Browse all colleges
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="group flex flex-col rounded-[24px] border border-slate-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#15945c]/25 hover:shadow-xl hover:shadow-slate-900/[0.04] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#15945c]/10 text-[#15945c] transition group-hover:bg-[#15945c] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-bold text-slate-300">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#15945c] transition group-hover:gap-3"
                  >
                    {service.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* INFORMATION TRUST */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#15945c]">
              Our commitment
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Useful information. Responsible decisions.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Educational information can change. Fees, deadlines,
              eligibility requirements, and admission procedures may
              differ between institutions and admission cycles.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              That is why students should use College Aadhar as a
              research resource and verify critical information before
              making an application or financial commitment.
            </p>
          </div>

          <div className="space-y-4">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className="flex gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-[#15945c]/20 hover:bg-[#f8fcf9] sm:gap-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold text-slate-900">
                        {principle.title}
                      </h3>

                      <span className="text-xs font-semibold text-[#15945c]/70">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {principle.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 sm:flex-row sm:items-start sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Always verify important details.
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Before applying, confirm the latest fees, deadlines,
              eligibility criteria, seat availability, and admission
              requirements directly with the official college or
              university website. Final admission decisions and
              requirements are determined by the respective institutions.
            </p>
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="border-y border-slate-100 bg-[#f8faf9]">
        <div className="mx-auto max-w-[950px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15945c]/10 text-[#15945c]">
            <HeartHandshake className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Our promise to students.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            We will keep working to improve the platform, make
            educational information easier to understand, and listen
            when students tell us something is missing or incorrect.
            We know that choosing a college is a significant decision,
            and we want our work to make that journey a little clearer.
          </p>

          <p className="mt-7 text-lg font-semibold text-[#15945c]">
            Your journey. Your decisions. A stronger foundation.
          </p>
        </div>
      </section>

      {/* CONTACT / FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute -right-20 top-0 -z-10 h-72 w-72 rounded-full bg-[#15945c]/10 blur-3xl"
        />

        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="relative overflow-hidden rounded-[30px] bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[45px] border-[#15945c]/20" />

            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#15945c]/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-[#62d6a0]" />
                  Your next chapter starts here
                </div>

                <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Your future deserves an{" "}
                  <span className="text-[#62d6a0]">
                    informed choice.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-slate-300">
                  Explore colleges, discover courses, and take the next
                  step toward an education that matches your goals.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/colleges"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#19a969]"
                >
                  Find your college
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/courses"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore courses
                  <BookOpen className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <p>
              College Aadhar — helping students explore their
              educational possibilities.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-[#15945c] hover:text-[#117b4b]"
            >
              Back to homepage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Small entrance animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[fadeInUp_0\\.65s_ease-out_both\\],
            .animate-\\[fadeInUp_0\\.8s_ease-out_both\\] {
              animation: none;
            }
          }
        `}
      </style>
    </main>
  );
}