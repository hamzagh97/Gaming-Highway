import { BadgeCheck, Headset, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { serviceHighlights, type ServiceIcon } from "@/data/site";

const icons: Record<ServiceIcon, LucideIcon> = {
  original: BadgeCheck,
  instant: Zap,
  support: Headset,
  secure: ShieldCheck,
};

export function ServiceBar() {
  return (
    <section aria-label="Why shop with us" className="py-4">
      <Container>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {serviceHighlights.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.id} className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-card sm:p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="hidden text-xs text-ink-soft sm:block">{item.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
