import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected branding, graphic design, print and visual storytelling by Light Creative Hub."
};
export const revalidate = 60;

type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  description?: string | null;
  cover_image_url: string | null;
  media_urls?: string[] | null;
  featured: boolean;
  display_order?: number;
};

async function getPublishedProjects(): Promise<PortfolioProject[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,description,cover_image_url,media_urls,featured,display_order,created_at")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Portfolio query failed:", error.message);
      return [];
    }
    return (data ?? []) as PortfolioProject[];
  } catch (error) {
    console.error("Portfolio could not connect to Supabase:", error);
    return [];
  }
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function ProjectMedia({ project, priority = false }: { project: PortfolioProject; priority?: boolean }) {
  const media = project.cover_image_url || project.media_urls?.[0] || "";
  if (!media) {
    return <div className="portfolio-media-placeholder"><span>LCH / SELECTED WORK</span><strong>{project.category}</strong></div>;
  }
  if (isVideo(media)) {
    return <video className="portfolio-cover-media" src={media} controls playsInline preload="metadata" aria-label={project.title} />;
  }
  return <img className="portfolio-cover-media" src={media} alt={project.title} loading={priority ? "eager" : "lazy"} />;
}

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  const featured = projects.find(project => project.featured) || projects[0];
  const remaining = featured ? projects.filter(project => project.id !== featured.id) : [];

  return <>
    <section className="portfolio-masthead">
      <div className="portfolio-masthead-top"><span>LIGHT CREATIVE HUB / PROJECT ARCHIVE</span><span>BRAND · PRINT · DESIGN</span></div>
      <div className="portfolio-masthead-main">
        <div>
          <p className="studio-kicker"><span className="kicker-line" /> SELECTED WORK / 2026</p>
          <h1>Ideas made<br/><em>visible.</em></h1>
          <p className="portfolio-masthead-intro">Selected identities, campaign visuals and print work—presented with the thinking, detail and craft behind each project.</p>
          <div className="portfolio-masthead-links"><a className="studio-button studio-button-blue" href="/request-a-quote">Have a project? Let’s talk <span>↗</span></a><span>{projects.length.toString().padStart(2,"0")} {projects.length === 1 ? "PROJECT IN THE ARCHIVE" : "PROJECTS IN THE ARCHIVE"}</span></div>
        </div>
        <div className="portfolio-masthead-side"><span className="portfolio-index">LCH—WORKS / ARCHIVE 001</span><div className="portfolio-type-specimen">WORK<br/><i>that</i><br/>SPEAKS<span>.</span></div><div className="portfolio-masthead-side-bottom"><span>FORM / FUNCTION / FEELING</span><span>SCROLL TO EXPLORE ↓</span></div></div>
      </div>
      <div className="portfolio-masthead-bottom"><span>CREATIVE DIRECTION WITH A PURPOSE.</span><span>01 — SELECTED PROJECTS</span></div>
    </section>

    {featured && <section className="portfolio-featured-section">
      <div className="portfolio-section-label"><span>01 / FEATURED PROJECT</span><span>{featured.category}</span></div>
      <div className="portfolio-featured-project">
        <Reveal className="portfolio-featured-media"><ProjectMedia project={featured} priority/><span className="portfolio-image-index">LCH / 001</span><span className="portfolio-image-corner">FEATURED WORK ↗</span></Reveal>
        <Reveal className="portfolio-featured-copy" delay={0.08}>
          <p className="studio-kicker"><span className="kicker-line"/> IDENTITY / GRAPHIC DESIGN</p>
          <h2>{featured.title}</h2>
          <p>{featured.summary || "A visual identity and communication piece from the Light Creative Hub studio."}</p>
          <div className="portfolio-detail-list"><div><span>DISCIPLINE</span><strong>{featured.category}</strong></div><div><span>FOCUS</span><strong>Visual identity & storytelling</strong></div><div><span>APPROACH</span><strong>Brand-led, clear, memorable</strong></div></div>
          <a className="studio-inline-link" href="/request-a-quote">Create something with us <span>↗</span></a>
        </Reveal>
      </div>
      {(featured.media_urls || []).filter(url => url !== featured.cover_image_url).length > 0 && <div className="portfolio-project-gallery">
        <div className="portfolio-gallery-heading"><span>PROJECT GALLERY</span><span>{(featured.media_urls || []).filter(url => url !== featured.cover_image_url).length.toString().padStart(2, "0")} MEDIA ITEMS</span></div>
        <div className="portfolio-gallery-grid">{(featured.media_urls || []).filter(url => url !== featured.cover_image_url).map((url, index) => <div className="portfolio-gallery-item" key={url}>{isVideo(url) ? <video src={url} controls playsInline preload="metadata" aria-label={featured.title + " gallery item " + (index + 1)} /> : <img src={url} alt={featured.title + " gallery item " + (index + 1)} loading="lazy" />}</div>)}</div>
      </div>}
    </section>}

    <section className="portfolio-archive-section">
      <div className="portfolio-archive-heading"><div><p className="studio-kicker">THE PROJECT ARCHIVE</p><h2>More work.<br/><em>More possibilities.</em></h2></div><p>Every project is chosen for its creative intent, execution and clarity. The archive is updated as new work is approved for publication.</p></div>
      {remaining.length ? <div className="portfolio-archive-grid">{remaining.map((project,index)=><Reveal key={project.id} delay={index*.04}><article className="portfolio-archive-card"><div className="portfolio-archive-media"><ProjectMedia project={project}/><span>{String(index+2).padStart(2,"0")} / LCH</span></div><div className="portfolio-archive-card-copy"><span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p></div>{(project.media_urls || []).filter(url => url !== project.cover_image_url).length > 0 && <div className="portfolio-card-gallery">{(project.media_urls || []).filter(url => url !== project.cover_image_url).map((url, mediaIndex) => <div className="portfolio-card-gallery-item" key={url}>{isVideo(url) ? <video src={url} controls playsInline preload="metadata" aria-label={project.title + " gallery item " + (mediaIndex + 1)} /> : <img src={url} alt={project.title + " gallery item " + (mediaIndex + 1)} loading="lazy" />}</div>)}</div>}</article></Reveal>)}</div> : <div className="portfolio-coming-soon"><div className="portfolio-coming-index">02—∞</div><div><span>THE ARCHIVE IS GROWING</span><h3>The archive is taking shape.</h3><p>New identity, campaign, print and visual-content projects will appear here as they are approved for publication. We showcase genuine work rather than placeholder concepts.</p><a href="https://wa.me/2347067376478?text=Hello%20Light%20Creative%20Hub%2C%20I%27d%20like%20to%20see%20more%20of%20your%20portfolio." target="_blank" rel="noopener noreferrer">Enquire about our work ↗</a></div></div>}
    </section>

    <section className="portfolio-cta-section"><div><p className="studio-kicker">YOUR BRAND DESERVES THOUGHTFUL WORK</p><h2>Let’s make something<br/><em>worth looking at.</em></h2></div><div><p>Tell us what you are building, launching or communicating. We’ll help you find the right creative direction.</p><a className="studio-button studio-button-white" href="/request-a-quote">Start a project <span>↗</span></a></div></section>
  </>;
}
