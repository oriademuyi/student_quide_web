"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

interface SubscribeRequiredDialogProps {
  open: boolean;
  profileHasError: boolean;
  onClose: () => void;
}

export function SubscribeRequiredDialog({
  open,
  profileHasError,
  onClose,
}: SubscribeRequiredDialogProps) {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        profileHasError ? "Couldn't Confirm Subscription" : "Subscription Required"
      }
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              if (profileHasError) {
                refreshProfile();
              } else {
                router.push("/subscription/plans");
              }
            }}
          >
            {profileHasError ? "Try Again" : "Subscribe Now"}
          </Button>
        </>
      }
    >
      {profileHasError
        ? "We couldn't confirm your subscription status. Please check your connection and try again."
        : "This feature is only available to subscribed students. Subscribe now to unlock full access."}
    </Dialog>
  );
}
