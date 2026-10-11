import { Mail, RotateCcw, ShieldCheck } from "lucide-react";
import type { Product } from "@/types";

/** What the customer receives and when. Everything is sent by email, so there is no address to collect. */
export function DeliveryInfo({ product }: { product: Product }) {
  const isKey = product.format === "key";

  return (
    <div className="divide-y divide-line rounded-xl border border-line text-sm">
      <div className="flex items-start gap-3 p-4">
        <Mail size={20} aria-hidden className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {product.preOrder
              ? `${isKey ? "Key" : "Account"} sent on release day`
              : `${isKey ? "Key" : "Account details"} sent by email in minutes`}
          </p>
          <p className="text-ink-soft">
            {isKey
              ? "Redeem the key on your platform's store to download the game."
              : "A fresh account that already owns this game. Log in and start downloading."}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4">
        <RotateCcw size={20} aria-hidden className="shrink-0" />
        <p>{isKey ? "Refundable until the key is revealed" : "Refundable until the account is accessed"}</p>
      </div>
      <div className="flex items-center gap-3 p-4">
        <ShieldCheck size={20} aria-hidden className="shrink-0" />
        <p>Secure card payment</p>
      </div>
    </div>
  );
}
