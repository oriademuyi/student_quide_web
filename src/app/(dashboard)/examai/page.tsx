import Link from "next/link";
import { HeaderCard } from "@/components/examai/ExamAiWidgets";

const FEATURES = [
  {
    href: "/examai/explain",
    icon: "💡",
    title: "Explain a Topic",
    subtitle: "Type a course statement or concept and get it broken down in easy terms.",
  },
  {
    href: "/examai/solve",
    icon: "✅",
    title: "Solve a Question",
    subtitle: "Type or upload a question and get a clear, step-by-step answer.",
  },
  {
    href: "/examai/summarize",
    icon: "📑",
    title: "Summarize Material",
    subtitle: "Upload your course material and get a quick summary or areas of concentration (AOC).",
  },
  {
    href: "/examai/interactions",
    icon: "🕑",
    title: "Past Interactions",
    subtitle: "Review explanations, solved questions and summaries you've generated before.",
  },
];

export default function ExamAiHomePage() {
  return (
    <div className="flex flex-col gap-5">
      <HeaderCard
        icon="✨"
        title="Your AI Study Buddy"
        description="Explain tricky concepts, solve questions, and summarize your materials in seconds — all in one place."
      />

      <div className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-status-green/10 text-2xl">
              {f.icon}
            </span>
            <div className="flex-1">
              <p className="font-bold text-neutral-900">{f.title}</p>
              <p className="text-sm text-neutral-500">{f.subtitle}</p>
            </div>
            <span className="text-neutral-300">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
