import Link from "next/link";

type CollegeBreadcrumbsProps = {
  college: {
    name: string;
    slug: string;
    city: {
      name: string;
      slug: string;
    };
    state: {
      name: string;
      slug: string;
    };
  };
};

export default function CollegeBreadcrumbs({
  college,
}: CollegeBreadcrumbsProps) {
  const items = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Colleges",
      href: "/colleges",
    },
    {
      name: college.state.name,
      href: `/colleges?state=${college.state.slug}`,
    },
    {
      name: college.city.name,
      href: `/colleges?city=${college.city.slug}`,
    },
    {
      name: college.name,
      href: `/college/${college.slug}`,
    },
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 lg:px-6">
        <ol className="flex min-w-max items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.href}-${item.name}`}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span className="text-slate-300">/</span>
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-slate-700"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-500 transition hover:text-[#15945c]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}