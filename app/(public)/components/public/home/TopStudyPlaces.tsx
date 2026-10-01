
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Landmark,
  MapPin,
  Mountain,
  Waves,
  type LucideIcon,
} from "lucide-react";

import { getTopStudyPlaces } from "@/services/home.service";

type TopStudyPlace = {
  id: string;
  name: string;
  slug: string;
  state: {
    name: string;
    slug: string;
  };
  collegeCount: number;
};

type CityIconConfig = {
  icon: LucideIcon;
  label: string;
};

function getCityIcon(
  cityName: string,
  stateName: string,
): CityIconConfig {
  const city = cityName.toLowerCase();
  const state = stateName.toLowerCase();

  // Delhi NCR
  if (
    city.includes("delhi") ||
    city.includes("new delhi") ||
    city.includes("gurugram") ||
    city.includes("gurgaon")
  ) {
    return {
      icon: Landmark,
      label: "Delhi NCR",
    };
  }

  // Bangalore
  if (
    city.includes("bangalore") ||
    city.includes("bengaluru")
  ) {
    return {
      icon: Building2,
      label: "Bangalore",
    };
  }

  // Hyderabad
  if (city.includes("hyderabad")) {
    return {
      icon: Landmark,
      label: "Hyderabad",
    };
  }

  // Pune
  if (city.includes("pune")) {
    return {
      icon: Building2,
      label: "Pune",
    };
  }

  // Mumbai
  if (
    city.includes("mumbai") ||
    city.includes("bombay")
  ) {
    return {
      icon: Waves,
      label: "Mumbai",
    };
  }

  // Chennai
  if (city.includes("chennai") || city.includes("madras")) {
    return {
      icon: Waves,
      label: "Chennai",
    };
  }

  // Kolkata
  if (city.includes("kolkata") || city.includes("calcutta")) {
    return {
      icon: Landmark,
      label: "Kolkata",
    };
  }

  // Bhopal
  if (city.includes("bhopal")) {
    return {
      icon: Mountain,
      label: "Bhopal",
    };
  }

  // Indore
  if (city.includes("indore")) {
    return {
      icon: Building2,
      label: "Indore",
    };
  }

  // Nagpur
  if (city.includes("nagpur")) {
    return {
      icon: Landmark,
      label: "Nagpur",
    };
  }

  // State-based fallback
  if (
    state.includes("goa") ||
    state.includes("kerala") ||
    state.includes("tamil")
  ) {
    return {
      icon: Waves,
      label: "Study Destination",
    };
  }

  if (
    state.includes("himachal") ||
    state.includes("uttarakhand") ||
    state.includes("jammu") ||
    state.includes("kashmir")
  ) {
    return {
      icon: Mountain,
      label: "Study Destination",
    };
  }

  return {
    icon: MapPin,
    label: "Study Destination",
  };
}

function getCollegeLabel(count: number) {
  return count === 1 ? "college" : "colleges";
}

export default async function TopStudyPlaces() {
  const places = await getTopStudyPlaces(10);

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Find your study destination
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Top Study Places
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore cities with colleges listed on College Aadhar
              and find the right place for your education journey.
            </p>
          </div>

          <Link
            href="/colleges"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            Explore colleges
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="font-medium text-slate-700">
              No study places are available yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cities will appear here when active colleges are
              available.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {places.map((place, index) => {
              const cityIcon = getCityIcon(
                place.name,
                place.state.name,
              );

              const CityIcon = cityIcon.icon;

              return (
                <Link
                  key={place.id}
                  href={`/colleges?city=${encodeURIComponent(place.slug)}`}
                  className="group"
                >
                  <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                    {/* City Icon */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                        <CityIcon
                          className="h-7 w-7"
                          strokeWidth={1.8}
                        />
                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        #{index + 1}
                      </span>
                    </div>

                    {/* City */}
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                      {place.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {place.state.name}
                    </p>

                    {/* College Count */}
                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
                      <Building2 className="h-4 w-4 text-emerald-600" />

                      <span className="font-semibold text-slate-700">
                        {place.collegeCount}
                      </span>

                      <span className="text-slate-500">
                        {getCollegeLabel(place.collegeCount)}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
