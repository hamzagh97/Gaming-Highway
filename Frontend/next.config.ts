import type { NextConfig } from "next";
import { IMAGE_HOSTS } from "./src/config/image-hosts";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. Next.js injects small inline scripts, so `'unsafe-inline'`
 * is needed for scripts unless you add nonce support through middleware (a good next
 * step: https://nextjs.org/docs/app/guides/content-security-policy). `'unsafe-eval'`
 * is only allowed in development, where React needs it for debugging.
 *
 * When you add a payment provider, analytics or remote images, add their hosts to
 * `script-src`, `connect-src`, `frame-src` and `img-src` below.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Product images: only the hosts listed in src/config/image-hosts.ts.
  `img-src 'self' data: blob:${IMAGE_HOSTS.map((host) => ` https://${host}`).join("")}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Only sent in production so local http://localhost keeps working.
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not advertise the framework in the X-Powered-By header.
  poweredByHeader: false,
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
