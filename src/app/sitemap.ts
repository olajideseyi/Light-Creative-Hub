import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const baseUrl = "https://light-creative-hub.vercel.app";
const staticRoutes = ["", "/about", "/services", "/portfolio", "/gallery", "/contact", "/request-a-quote", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: baseUrl + route,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/portfolio" || route === "/gallery" ? 0.9 : 0.7
  }));

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("slug,updated_at")
      .eq("published", true);
    if (error) return routes;
    return routes.concat((data ?? []).map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })));
  } catch {
    return routes;
  }
}
