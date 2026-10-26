import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GalleryBrowser, type GalleryItem } from "@/components/gallery-browser";

export const metadata: Metadata = {
  title: "Gallery | Photography & Film",
  description: "Photography, photoshoots, video stories and visual work from Light Creative Hub."
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  cover_image_url: string | null;
  media_urls: string[] | null;
};

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}
function isImage(url: string) {
  return /\.(jpe?g|png|webp|avif|gif)(\?.*)?$/i.test(url);
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    const items: GalleryItem[] = [];
    for (const project of data as ProjectRow[]) {
      const candidates = [project.cover_image_url, ...(project.media_urls ?? [])].filter((url): url is string => Boolean(url));
      const seen = new Set<string>();
      for (const url of candidates) {
        if (seen.has(url) || (!isImage(url) && !isVideo(url))) continue;
        seen.add(url);
        items.push({
          id: `${project.id}-${items.length}`,
          title: project.title,
          category: project.category || (isVideo(url) ? "Video" : "Photography"),
          description: project.summary || "",
          url,
          kind: isVideo(url) ? "video" : "image",
          projectUrl: `/portfolio/${project.slug}`
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <section className="gallery-page">
      <div className="gallery-page-heading">
        <div>
          <p className="studio-kicker">LIGHT CREATIVE HUB / VISUAL ARCHIVE</p>
          <h1>Made to be <em>seen.</em></h1>
        </div>
        <p>A growing collection of photoshoots, moving images and visual stories from our creative work. Every published image or video in the studio portfolio can appear here.</p>
      </div>
      <GalleryBrowser items={items} />
      <div className="gallery-upload-note">
        <div><span className="gallery-overline">FOR THE STUDIO TEAM</span><h2>Have new work to share?</h2><p>Sign in to the Studio CMS, open a project, add the photos or video files to its gallery, then publish the project. Published media appears here automatically.</p></div>
        <a href="/admin">Open Studio CMS <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
