"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/toast-context";
import { isValidEmail } from "@/lib/validation";

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast("Please enter a valid email address", { tone: "error" });
      return;
    }
    toast("Thanks for subscribing! (demo, nothing was sent)", { tone: "success" });
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="h-11 min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-brand"
      />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
