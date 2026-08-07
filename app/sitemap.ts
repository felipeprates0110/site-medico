import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { specialties } from "@/data/specialties";
import { treatments } from "@/data/treatments";
import { getPublishedArticles } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/especialidades`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tratamentos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/avaliacoes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/convenios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agendar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/segunda-opiniao`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // Specialty pages
  const specialtyPages: MetadataRoute.Sitemap = specialties.map(
    (specialty) => ({
      url: `${baseUrl}/especialidades/${specialty.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  // Treatment pages
  const treatmentPages: MetadataRoute.Sitemap = treatments.map((treatment) => ({
    url: `${baseUrl}/tratamentos/${treatment.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Blog posts publicados (indexação Google)
  const articles = await getPublishedArticles();
  const blogPages: MetadataRoute.Sitemap = articles
    .filter((article) => Boolean(article.slug))
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(
        article.updated_at || article.published_at || article.created_at
      ),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  return [...staticPages, ...specialtyPages, ...treatmentPages, ...blogPages];
}
