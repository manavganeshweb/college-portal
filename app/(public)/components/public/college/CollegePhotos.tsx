import Image from "next/image";
import Link from "next/link";

import type { CollegeDetail } from "@/services/college.service";

type CollegePhotosProps = {
  college: CollegeDetail;
};

export default function CollegePhotos({
  college,
}: CollegePhotosProps) {
  const photos = college.photos ?? [];

  return (
    <article className="space-y-6">
      <section
        id="photos"
        className="scroll-mt-24 rounded-2xl bg-white p-5 shadow-sm md:p-7"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {college.name} Photos
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Explore campus, infrastructure, facilities and other photos of{" "}
            {college.name}.
          </p>
        </div>

        {photos.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={photo.imageUrl}
                    alt={
                      photo.title ||
                      `${college.name} campus photo`
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {photo.title && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {photo.title}
                    </h3>

                    {photo.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                        {photo.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#15945c]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>

            <p className="mt-4 font-semibold text-gray-800">
              Photos are currently unavailable.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              College photos will be added when available.
            </p>
          </div>
        )}
      </section>
    </article>
  );
}