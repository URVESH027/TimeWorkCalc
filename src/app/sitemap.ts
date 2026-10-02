import type { MetadataRoute } from "next";

const BASE_URL = "https://www.timeworkcalc.com";

const CALCULATOR_SLUGS = [
  "time-card-calculator",
  "work-hours-calculator",
  "hours-calculator",
  "time-calculator",
  "decimal-hours-calculator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = CALCULATOR_SLUGS.map(
    (slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const otherPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  return [...staticPages, ...calculatorPages, ...otherPages];
}
