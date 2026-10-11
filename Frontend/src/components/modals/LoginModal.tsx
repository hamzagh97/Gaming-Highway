"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/cn";
import { isValidEmail } from "@/lib/validation";

type Mode = "signin" | "signup";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function AuthForm({ onDone }: { onDone: () => void }) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (mode === "signup" && name.trim().length < 2) nextErrors.name = "Enter your name";
    if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address";
    if (password.length < 6) nextErrors.password = "Use at least 6 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const displayName = name.trim() || email.split("@")[0];
    login({ name: displayName, email: email.trim() });
    toast(mode === "signup" ? `Welcome to Gaming Highway TN, ${displayName}!` : `Welcome back, ${displayName}!`, {
      tone: "success",
    });
    onDone();
  };

  return (
    <div className="p-5">
      <div role="tablist" className="mb-5 grid grid-cols-2 rounded-xl bg-surface-muted p-1">
        {(["signin", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => {
              setMode(item);
              setErrors({});
            }}
            className={cn(
              "rounded-lg py-2 text-sm font-bold transition",
              mode === item ? "bg-surface shadow-card" : "text-ink-muted hover:text-ink",
            )}
          >
            {item === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === "signup" && (
          <TextField
            label="Full name"
            name="name"
            autoComplete="name"
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />
        )}
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" size="lg" fullWidth>
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        <p className="text-center text-xs text-ink-muted">
          Demo only: any valid email and a 6+ character password will work. Nothing is sent or stored on a server.
        </p>
      </form>
    </div>
  );
}

export function LoginModal() {
  const { modal, closeModal } = useUI();
  const open = modal === "login";

  return (
    <Modal open={open} onClose={closeModal} title="Welcome" size="sm">
      {open && <AuthForm onDone={closeModal} />}
    </Modal>
  );
}
