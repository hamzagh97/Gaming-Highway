import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { platforms } from "@/data/platforms";
import { footerLinkGroups } from "@/data/site";
import { SITE } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const linkClasses = "text-sm text-white/70 transition hover:text-white";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Logo className="h-24 sm:h-28 lg:h-28" />
          <p className="max-w-sm text-sm text-white/70">
            Get new releases, pre-order alerts and deals in your inbox. This is a demo store, so no emails are sent.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold">Shop by platform</h3>
          <ul className="space-y-2">
            {platforms.map((platform) => (
              <li key={platform.slug}>
                <Link href={ROUTES.browse({ device: platform.slug })} className={linkClasses}>
                  {platform.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {footerLinkGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm font-bold">{group.title}</h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE.name}. Demo storefront: game titles and studios are fictional.</p>
          <p>We accept: credit / debit card</p>
        </Container>
      </div>
    </footer>
  );
}
