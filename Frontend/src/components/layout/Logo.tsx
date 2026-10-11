import { SITE } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

/**
 * The brand logo (`public/logo.png`, transparent background, made for dark surfaces).
 * Pass a height class to resize it, e.g. `<Logo className="h-24" />`: the width follows.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${SITE.name} home`}
      className="inline-flex shrink-0 items-center"
    >
      <span
        className={
          "inline-flex items-center font-extrabold capitalize leading-none tracking-tight text-[#fff] " +
          (className ?? "")
        }
        style={{ fontSize: "1.7rem" }}
      >
        <span>Gaming Highway</span>
      </span>
    </Link>
  );
}
