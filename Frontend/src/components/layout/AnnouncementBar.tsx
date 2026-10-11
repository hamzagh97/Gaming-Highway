import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div className="bg-brand text-xs font-semibold text-on-brand">
      <Container className="flex h-8 items-center justify-between gap-4">
        <p className="truncate">
          Instant delivery by email · Game keys and fresh accounts for PC, PS5
          and Xbox
        </p>
        <p className="hidden shrink-0 text-on-brand/70 sm:block">
          Need help? {SITE.supportEmail}
        </p>
      </Container>
    </div>
  );
}
