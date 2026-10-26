import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GalleryBrowser, type GalleryItem } from "@/components/gallery-browser";

export const metadata: Metadata = {
  title: "Gallery | Photography & Film",
  description: "Photography, photoshoots, video stories and visual work from Light Creative Hub."
};

type ProjectRow = { id: string; title: string; slug: string; category: string; summary: string | null; cover_image_url: string | null; media_urls: string[] | null; };
type GalleryRow = { id: string; title: string; description: string | null; category: string; media_url: string; media_type: "image" | "video"; published: boolean; display_order: number; };

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}
function isImage(url: string) {
  return /\.(jpe?g|png|webp|avif|gif)(\?.*)?$/i.test(url);
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    const items: GalleryItem[] = [];
    const { data: directItems, error: galleryError } = await supabase.from("gallery_items")
      .select("id,title,description,category,media_url,media_type,published,display_order")
      .eq("published", true).order("featured", { ascending: false }).order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (!galleryError && directItems) {
      for (const item of directItems as GalleryRow[]) items.push({
        id: item.id, title: item.title, category: item.category || (item.media_type === "video" ? "Video" : "Photography"),
        description: item.description || "", url: item.media_url, kind: item.media_type, projectUrl: "/gallery"
      });
    }
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return items;
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
        <div><span className="gallery-overline">FOR THE STUDIO TEAM</span><h2>Have new work to share?</h2><p>Photoshoots and videos can be uploaded directly in the dedicated Gallery Manager, without creating a portfolio project.</p></div>
        <a href="/admin/gallery">Open Gallery Manager <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
