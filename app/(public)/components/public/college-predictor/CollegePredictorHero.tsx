import { ArrowDown, CheckCircle2, Sparkles } from "lucide-react";

export default function CollegePredictorHero() {
  return (
    <section className="relative overflow-hidden bg-[#e8f7ef]">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            College Predictor
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Find colleges that match
            <span className="block text-emerald-700">
              your rank.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Enter your exam, rank and category to explore colleges
            whose available cutoff data matches your profile.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {[
              "Cutoff-based prediction",
              "College-wise results",
              "Updated database",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>

          <a
            href="#predictor"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Start Predicting
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}