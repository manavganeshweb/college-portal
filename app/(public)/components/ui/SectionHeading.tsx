import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  center?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  center = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 flex flex-col gap-5 ${
        center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-green-600">
            {eyebrow}
          </div>
        )}

        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}