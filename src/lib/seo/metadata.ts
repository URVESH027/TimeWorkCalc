import type { Metadata } from "next";
import type { CalculatorMeta } from "@/types/calculator";

const SITE_NAME = "TimeWorkCalc";
const SITE_URL = "https://www.timeworkcalc.com";
const DEFAULT_DESCRIPTION =
  "Free online time and work-hours calculators. Calculate hours, duration, breaks, and decimal hours.";
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "TimeWorkCalc — Time & Work-Hours Calculators",
};

/**
 * Generate metadata for a calculator page
 */
export function generateCalculatorMetadata(
  calc: CalculatorMeta,
): Metadata {
  const url = `${SITE_URL}${calc.canonicalPath}`;
  const title = calc.title;

  return {
    title,
    description: calc.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: calc.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description: calc.description,
    },
  };
}

/**
 * Generate metadata for the homepage
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: `${SITE_NAME} - Time & Work-Hours Calculators`,
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: `${SITE_NAME} - Time & Work-Hours Calculators`,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}
