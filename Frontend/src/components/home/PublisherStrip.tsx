import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredPublishers } from "@/data/site";

export function PublisherStrip() {
  return (
    <section className="py-6">
      <Container>
        <div className="rounded-card bg-surface p-4 shadow-card sm:p-6">
          <SectionHeader title="Top publishers" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredPublishers.map((publisher) => (
              <li
                key={publisher}
                className="grid h-16 place-items-center rounded-xl border border-line bg-surface-muted px-2 text-center text-sm font-black tracking-tight text-ink-soft transition hover:border-brand hover:bg-brand-soft hover:text-accent"
              >
                {publisher}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
