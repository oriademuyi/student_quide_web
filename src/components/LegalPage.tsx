interface LegalSection {
  heading: string;
  body: string;
}

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mb-6 text-xs text-neutral-500">Last updated: {lastUpdated}</p>
      <p className="mb-6 text-sm leading-relaxed text-neutral-700">{intro}</p>
      {sections.map((s) => (
        <div key={s.heading} className="mb-6">
          <h2 className="mb-2 text-base font-bold text-neutral-900">
            {s.heading}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}
