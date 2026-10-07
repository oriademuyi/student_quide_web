import Link from "next/link";

export default function SubscriptionPromptPage() {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <span className="text-5xl">🌟</span>
      <h1 className="text-2xl font-bold text-neutral-900">
        Unlock Full Access
      </h1>
      <p className="max-w-sm text-sm text-neutral-600">
        Subscribe to get unlimited access to ExamAI explanations, solved
        questions, material summaries, course materials and past questions.
      </p>
      <Link
        href="/subscription/plans"
        className="rounded-xl bg-status-green px-6 py-3 text-sm font-semibold text-white"
      >
        Subscribe Now
      </Link>
      <Link href="/dashboard" className="text-sm font-medium text-neutral-500">
        Continue for free
      </Link>
    </div>
  );
}
