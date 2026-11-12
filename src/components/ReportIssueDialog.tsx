"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/AuthProvider";
import { whatsappChatUrl } from "@/lib/whatsapp";

const ISSUE_CATEGORIES = [
  "Email Issue",
  "Exam Issue",
  "Project Issue",
  "TMA Issue",
  "Token Issue",
  "Other",
];

export function ReportIssueDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [issue, setIssue] = useState("");

  function handleSend() {
    if (!issue.trim()) return;

    const lines = [
      "Hello, I'd like to report an issue.",
      "",
      `Name: ${profile?.name ?? "N/A"}`,
      `Matric Number: ${profile?.matricNumber ?? "N/A"}`,
      `Phone: ${profile?.phone ?? "N/A"}`,
      `Issue Type: ${category}`,
      "",
      "Details:",
      issue.trim(),
    ];

    window.open(whatsappChatUrl(lines.join("\n")), "_blank", "noopener,noreferrer");

    setIssue("");
    setCategory(ISSUE_CATEGORIES[0]);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Report an Issue"
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
          Having trouble with your school email, an exam, a project, a TMA, or
          a login token? Let us know and we&apos;ll open WhatsApp with your
          details ready to send.
        </p>
        <Select
          label="What issue are you facing?"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {ISSUE_CATEGORIES.map((c) => (
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
          placeholder="e.g. My TMA submission isn't showing on the portal..."
        />
      </div>
    </Dialog>
  );
}
