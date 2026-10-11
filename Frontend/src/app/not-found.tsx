import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="rounded-card bg-surface shadow-card">
        <EmptyState
          icon={<SearchX size={28} aria-hidden />}
          title="We could not find that page"
          description="The product or page you are looking for may have moved or no longer exists."
          action={<ButtonLink href={ROUTES.home}>Back to home</ButtonLink>}
        />
      </div>
    </Container>
  );
}
