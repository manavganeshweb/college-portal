type AdmissionData = {
  status?: string | null;
  year?: number | null;
  applicationStartDate?: Date | null;
  applicationEndDate?: Date | null;
  process?: string | null;
  entranceRequirement?: string | null;
  selectionProcess?: string | null;
  applicationUrl?: string | null;
};

type Props = {
  admission: AdmissionData;
};

export default function AdmissionSection({
  admission,
}: Props) {
  const hasContent =
    admission.status ||
    admission.year ||
    admission.applicationStartDate ||
    admission.applicationEndDate ||
    admission.process ||
    admission.entranceRequirement ||
    admission.selectionProcess;

  if (!hasContent) {
    return null;
  }

  return (
    <section
      id="admission"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#15945c]">
          Admission
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Admission
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {admission.status && (
          <Info label="Admission Status" value={admission.status} />
        )}

        {admission.year && (
          <Info label="Admission Year" value={String(admission.year)} />
        )}

        {admission.applicationStartDate && (
          <Info
            label="Application Starts"
            value={formatDate(admission.applicationStartDate)}
          />
        )}

        {admission.applicationEndDate && (
          <Info
            label="Application Deadline"
            value={formatDate(admission.applicationEndDate)}
          />
        )}
      </div>

      {admission.process && (
        <ContentBlock
          title="Admission Process"
          content={admission.process}
        />
      )}

      {admission.entranceRequirement && (
        <ContentBlock
          title="Entrance Requirement"
          content={admission.entranceRequirement}
        />
      )}

      {admission.selectionProcess && (
        <ContentBlock
          title="Selection Process"
          content={admission.selectionProcess}
        />
      )}

      {admission.applicationUrl && (
        <a
          href={admission.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-lg bg-[#15945c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#117a4b]"
        >
          Apply Now
        </a>
      )}
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ContentBlock({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
        {content}
      </p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}