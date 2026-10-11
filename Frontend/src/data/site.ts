export type ServiceIcon = "original" | "instant" | "support" | "secure";

export interface ServiceHighlight {
  id: string;
  icon: ServiceIcon;
  title: string;
  description: string;
}

export const serviceHighlights: ServiceHighlight[] = [
  { id: "original", icon: "original", title: "100% original games", description: "Genuine keys and fresh accounts only" },
  { id: "instant", icon: "instant", title: "Instant delivery", description: "Keys and accounts sent by email in minutes" },
  { id: "support", icon: "support", title: "Help when you need it", description: "Our team answers your questions fast" },
  { id: "secure", icon: "secure", title: "Secure payment", description: "Pay safely by card" },
];

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

/** Placeholder destinations: these pages are outside the scope of the demo. */
export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Customer service",
    links: [
      { label: "Help centre", href: "#" },
      { label: "Track your order", href: "#" },
      { label: "How keys & accounts work", href: "#" },
      { label: "Refund policy", href: "#" },
    ],
  },
  {
    title: "Gaming Highway TN",
    links: [
      { label: "About us", href: "#" },
      { label: "Delivery information", href: "#" },
      { label: "Terms & conditions", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

export const popularSearches = ["Starfall", "Racing", "Pitch Masters", "Co-op", "Horror", "Pre-order"];

/** Fictional publishers shown in the "Top publishers" strip. */
export const featuredPublishers = [
  "Northwind Interactive",
  "Emberlight Studios",
  "Apex Garage Games",
  "Glitchwave Games",
  "Goalpost Sports",
  "Moonhollow Games",
  "Ironclad Studios",
  "Sunny Reef Games",
];
