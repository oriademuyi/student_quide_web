"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/AuthProvider";
import { whatsappChatUrl } from "@/lib/whatsapp";

const CATEGORIES = [
  "Payment / Subscription",
  "Technical Issue",
  "Account / Login",
  "ExamAI",
  "Other",
];

export function ContactSupportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [issue, setIssue] = useState("");

  function handleSend() {
    if (!issue.trim()) return;

    const lines = [
      "Hello, I need help with the Student Guide app.",
      "",
      `Name: ${profile?.name ?? "N/A"}`,
      `Email: ${profile?.email ?? "N/A"}`,
      profile?.matricNumber ? `Matric Number: ${profile.matricNumber}` : null,
      `Category: ${category}`,
      "",
      "Issue:",
      issue.trim(),
    ].filter((line): line is string => line !== null);

    window.open(whatsappChatUrl(lines.join("\n")), "_blank", "noopener,noreferrer");

    setIssue("");
    setCategory(CATEGORIES[0]);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Contact Support"
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!issue.trim()}>
            Send on WhatsApp
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-left">
        <p className="text-sm text-neutral-600">
          Tell us what you&apos;re facing and we&apos;ll open WhatsApp with your
          message ready to send.
        </p>
        <Select
          label="What's this about?"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Textarea
          label="Describe the issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          rows={4}
          placeholder="e.g. My payment was deducted but my subscription still shows as inactive..."
        />
      </div>
    </Dialog>
  );
}
