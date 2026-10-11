"use client";

import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useUI } from "@/context/ui-context";
import { ROUTES } from "@/lib/routes";

export function OrderSuccessModal() {
  const router = useRouter();
  const { modal, orderNumber, closeModal } = useUI();

  const handleContinue = () => {
    closeModal();
    router.push(ROUTES.home);
  };

  return (
    <Modal open={modal === "order-success"} onClose={handleContinue} title="Order placed" size="sm">
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <span className="grid size-16 animate-pop place-items-center rounded-full bg-success-soft text-success">
          <PartyPopper size={30} aria-hidden />
        </span>
        <h3 className="text-xl font-extrabold">Thank you for your order!</h3>
        <p className="text-sm text-ink-soft">
          Your order number is <span className="font-bold text-ink">{orderNumber}</span>.
        </p>
        <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink-muted">
          This is a demo store: no payment was taken and no order was created.
        </p>
        <Button size="lg" fullWidth className="mt-2" onClick={handleContinue}>
          Continue shopping
        </Button>
      </div>
    </Modal>
  );
}
