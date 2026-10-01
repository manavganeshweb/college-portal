import {
  Building2,
  Dumbbell,
  GraduationCap,
  Hospital,
  Library,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";

type InfrastructureFacility = {
  id: string;
  name: string;
  description: string | null;
  available: boolean;
  sortOrder: number;
  isActive: boolean;
};

type CollegeInfrastructureData = {
  campusArea: string | null;
  campusType: string | null;
  description: string | null;

  hostel: boolean;
  library: boolean;
  laboratories: boolean;
  sports: boolean;
  cafeteria: boolean;
  auditorium: boolean;
  medical: boolean;
  wifi: boolean;
  itInfrastructure: boolean;
  transportation: boolean;
  gym: boolean;

  otherFacilities: string | null;

  facilities: InfrastructureFacility[];
};

type CollegePhoto = {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
};

type CollegeInfrastructureProps = {
  collegeName: string;
  infrastructure: CollegeInfrastructureData | null;
  photos: CollegePhoto[];
};
type Facility = {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
};

export default function CollegeInfrastructure({
  collegeName,
  infrastructure,
  photos,
}: CollegeInfrastructureProps) {
  const activePhotos = photos
    .filter((photo) => photo.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const facilities: Facility[] = infrastructure
    ? [
        {
          label: "Library",
          icon: <Library className="h-5 w-5" />,
          enabled: infrastructure.library,
        },
        {
          label: "Hostel",
          icon: <Building2 className="h-5 w-5" />,
          enabled: infrastructure.hostel,
        },
        {
          label: "Laboratories",
          icon: <GraduationCap className="h-5 w-5" />,
          enabled: infrastructure.laboratories,
        },
        {
          label: "Sports",
          icon: <Dumbbell className="h-5 w-5" />,
          enabled: infrastructure.sports,
        },
        {
          label: "Cafeteria",
          icon: <Utensils className="h-5 w-5" />,
          enabled: infrastructure.cafeteria,
        },
        {
          label: "Auditorium",
          icon: <Building2 className="h-5 w-5" />,
          enabled: infrastructure.auditorium,
        },
        {
          label: "Medical Facilities",
          icon: <Hospital className="h-5 w-5" />,
          enabled: infrastructure.medical,
        },
        {
          label: "Wi-Fi",
          icon: <Wifi className="h-5 w-5" />,
          enabled: infrastructure.wifi,
        },
        {
          label: "IT Infrastructure",
          icon: <Zap className="h-5 w-5" />,
          enabled: infrastructure.itInfrastructure,
        },
        {
          label: "Transportation",
          icon: <Building2 className="h-5 w-5" />,
          enabled: infrastructure.transportation,
        },
        {
          label: "Gym",
          icon: <Dumbbell className="h-5 w-5" />,
          enabled: infrastructure.gym,
        },
      ].filter((facility) => facility.enabled)
    : [];

  const customFacilities =
    infrastructure?.facilities.filter(
      (facility) => facility.isActive && facility.available
    ) ?? [];

  const hasInfrastructure =
    infrastructure !== null &&
    (infrastructure.description ||
      infrastructure.campusArea ||
      infrastructure.campusType ||
      facilities.length > 0 ||
      customFacilities.length > 0 ||
      infrastructure.otherFacilities);

  return (
    <article
      id="infrastructure"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <Building2 className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {collegeName} Infrastructure
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore campus infrastructure, facilities and student
              amenities available at {collegeName}.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-7 sm:px-7 sm:py-8">
        {/* Campus information */}
        {hasInfrastructure && (
          <div className="space-y-6">
            {(infrastructure?.campusArea ||
              infrastructure?.campusType ||
              infrastructure?.description) && (
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Campus & Facilities
                </h3>

                {infrastructure.description && (
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                    {infrastructure.description}
                  </p>
                )}

                {(infrastructure.campusArea ||
                  infrastructure.campusType) && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {infrastructure.campusArea && (
                      <InfoBadge
                        label="Campus Area"
                        value={infrastructure.campusArea}
                      />
                    )}

                    {infrastructure.campusType && (
                      <InfoBadge
                        label="Campus Type"
                        value={infrastructure.campusType}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Photo gallery */}
            {activePhotos.length > 0 && (
              <CampusGallery
                collegeName={collegeName}
                photos={activePhotos}
              />
            )}

            {/* Standard facilities */}
            {facilities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Facilities
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {facilities.map((facility) => (
                    <FacilityCard
                      key={facility.label}
                      icon={facility.icon}
                      label={facility.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom facilities */}
            {customFacilities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Other Facilities
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {customFacilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <h4 className="text-sm font-semibold text-slate-900">
                        {facility.name}
                      </h4>

                      {facility.description && (
                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {facility.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {infrastructure?.otherFacilities && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Additional Facilities
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {infrastructure.otherFacilities}
                </p>
              </div>
            )}
          </div>
        )}

        {/* No data */}
        {!hasInfrastructure && activePhotos.length === 0 && (
          <div className="mx-auto max-w-2xl py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#15945c]/10">
              <Building2 className="h-8 w-8 text-[#15945c]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Infrastructure information coming soon
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Detailed infrastructure and campus facility information
              has not been added for this college yet.
            </p>
          </div>
        )}

        {/* Photos exist but infrastructure doesn't */}
        {!hasInfrastructure && activePhotos.length > 0 && (
          <CampusGallery
            collegeName={collegeName}
            photos={activePhotos}
          />
        )}
      </div>
    </article>
  );
}

function CampusGallery({
  collegeName,
  photos,
}: {
  collegeName: string;
  photos: CollegePhoto[];
}) {
  const visiblePhotos = photos.slice(0, 5);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Campus & Facilities
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Explore {collegeName}&apos;s campus and facilities.
          </p>
        </div>

        {photos.length > 5 && (
          <button
            type="button"
            className="shrink-0 text-sm font-semibold text-[#15945c] hover:underline"
          >
            View all photos →
          </button>
        )}
      </div>

      <div className="mt-5 grid h-[420px] grid-cols-2 gap-3 sm:grid-cols-3">
        {visiblePhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`group relative overflow-hidden rounded-xl bg-slate-100 ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title || `${collegeName} campus`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12">
              <p className="text-sm font-semibold text-white">
                {photo.title || photo.category || "Campus"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilityCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#15945c]/30 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#15945c]/10 text-[#15945c]">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-800">
          {label}
        </span>
      </div>
    </div>
  );
}

function InfoBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}