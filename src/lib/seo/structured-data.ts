import type { BreadcrumbItem } from "@/types/calculator";

/**
 * Generate WebSite structured data
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TimeWorkCalc",
    url: "https://www.timeworkcalc.com",
    description:
      "Free online time and work-hours calculators for professionals.",
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(
  items: BreadcrumbItem[],
  baseUrl = "https://www.timeworkcalc.com",
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

/**
 * Generate Calculator structured data for a specific calculator page
 */
export function generateCalculatorStructuredData(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `https://www.timeworkcalc.com${path}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
