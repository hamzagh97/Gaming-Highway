"use client";

import { Menu } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useUI } from "@/context/ui-context";

export function MobileMenuButton() {
  const { openModal } = useUI();

  return (
    <IconButton label="Open menu" className="-ml-2 lg:hidden" onClick={() => openModal("menu")}>
      <Menu size={24} aria-hidden />
    </IconButton>
  );
}
