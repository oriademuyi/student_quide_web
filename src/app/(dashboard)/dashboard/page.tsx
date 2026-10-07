"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bell,
  BookOpenCheck,
  GraduationCap,
  Library,
  Lock,
  PenLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SubscribeRequiredDialog } from "@/components/SubscribeRequiredDialog";

const FREE_CARD_TITLE = "How to register for new Semester";

interface DashboardCard {
  title: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const CARDS: DashboardCard[] = [
  {
    title: FREE_CARD_TITLE,
    href: "/guides/register-semester",
    icon: BookOpenCheck,
    iconBg: "bg-card-green",
    iconColor: "text-accent-green",
  },
  {
    title: "How to Do TMA",
    href: "/guides/tma",
    icon: PenLine,
    iconBg: "bg-card-yellow",
    iconColor: "text-status-yellow",
  },
  {
    title: "Course Materials",
    href: "/materials",
    icon: Library,
    iconBg: "bg-card-purple",
    iconColor: "text-purple",
  },
  {
    title: "Past Questions",
    href: "/past-questions",
    icon: Archive,
    iconBg: "bg-card-red",
    iconColor: "text-status-red",
  },
  {
    title: "How to Write Exams",
    href: "/guides/exam",
    icon: GraduationCap,
    iconBg: "bg-card-green",
    iconColor: "text-accent-green",
  },
  {
    title: "AOC",
    href: "/examai/summarize",
    icon: Sparkles,
    iconBg: "bg-card-purple",
    iconColor: "text-purple",
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    iconBg: "bg-card-yellow",
    iconColor: "text-status-yellow",
  },
];

export default function DashboardHomePage() {
  const router = useRouter();
  const { isSubscribed, profileHasError, profile } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  function onCardClick(card: DashboardCard) {
    const isFree = card.title === FREE_CARD_TITLE;
    if (isFree || isSubscribed) {
      router.push(card.href);
    } else {
      setShowDialog(true);
    }
  }

  const firstName = profile?.name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-status-green to-accent-green p-8 text-white">
        <GraduationCap
          size={160}
          strokeWidth={1}
          className="pointer-events-none absolute -right-6 -top-6 opacity-15"
        />
        <div className="relative">
          <p className="text-sm font-medium text-white/80">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold">{firstName ?? "Student"}</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
            Everything you need for your studies — guides, materials, past
            questions and AI-powered help — all in one place.
          </p>

          {!isSubscribed && (
            <button
              onClick={() => router.push("/subscription/plans")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-status-green transition-transform hover:scale-105"
            >
              <Lock size={16} />
              Subscribe to unlock everything
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => onCardClick(card)}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}
              >
                <Icon size={26} className={card.iconColor} strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold text-neutral-800">
                {card.title}
              </span>
            </button>
          );
        })}
      </div>

      <SubscribeRequiredDialog
        open={showDialog}
        profileHasError={profileHasError}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}
