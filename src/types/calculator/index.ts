/**
 * Calculator metadata for routing and SEO
 */
export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  canonicalPath: string;
}

/**
 * Related calculator link
 */
export interface RelatedCalculator {
  slug: string;
  title: string;
  description: string;
}

/**
 * Base calculator page props
 */
export interface CalculatorPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Result display configuration
 */
export interface ResultItem {
  label: string;
  value: string;
  unit?: string;
}

/**
 * Calculator section for structured content
 */
export interface CalculatorSection {
  id: string;
  title: string;
  content?: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Structured data for a calculator page
 */
export interface CalculatorStructuredData {
  name: string;
  description: string;
  url: string;
  breadcrumbs: BreadcrumbItem[];
}
