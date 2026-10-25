import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  description: string | null;
  cover_image_url: string | null;
  media_urls: string[] | null;
  featured: boolean;
};

async function getProject(slug: string): Promise<PortfolioProject | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("id,title,slug,category,summary,description,cover_image_url,media_urls,featured")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.error("Portfolio detail query failed:", error.message);
      return null;
    }
    return data as PortfolioProject | null;
  } catch {
    return null;
  }
}

function isVideo(url: string) {
  return /\\.(mp4|webm|mov|m4v)(\\?.*)?$/i.test(url);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: (project.summary || project.description || `Selected ${project.category.toLowerCase()} work by Light Creative Hub.`).slice(0, 160),
    openGraph: {
      title: project.title,
      description: (project.summary || project.description || "Selected work by Light Creative Hub.").slice(0, 160),
      type: "article",
      ...(project.cover_image_url && !isVideo(project.cover_image_url) ? { images: [project.cover_image_url] } : {})
    }
  };
}

export default async function PortfolioProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const gallery = Array.from(new Set([
    ...(project.cover_image_url ? [project.cover_image_url] : []),
    ...(project.media_urls || [])
  ]));

  return <>
    <section className="portfolio-masthead">
      <div className="portfolio-masthead-top"><span>LIGHT CREATIVE HUB / PROJECT STORY</span><span>{project.category.toUpperCase()}</span></div>
      <div className="portfolio-masthead-main">
        <div>
          <p className="studio-kicker"><span className="kicker-line" /> SELECTED WORK / PROJECT DETAIL</p>
          <h1>{project.title}</h1>
          <p className="portfolio-masthead-intro">{project.summary || `A closer look at this ${project.category.toLowerCase()} project from Light Creative Hub.`}</p>
          <div className="portfolio-masthead-links"><Link className="studio-button studio-button-blue" href="/request-a-quote">Start a similar project <span>↗</span></Link><Link className="studio-inline-link" href="/portfolio">← Back to all work</Link></div>
        </div>
        <div className="portfolio-masthead-side"><span className="portfolio-index">LCH—WORKS / DETAIL</span><div className="portfolio-type-specimen">{project.category.split(" ").slice(0, 3).join(" ")}<span>.</span></div><div className="portfolio-masthead-side-bottom"><span>FORM / FUNCTION / FEELING</span><span>PROJECT STORY</span></div></div>
      </div>
      <div className="portfolio-masthead-bottom"><span>{project.category.toUpperCase()}</span><span>PROJECT / {project.slug.toUpperCase()}</span></div>
    </section>

    <section className="portfolio-featured-section">
      <div className="portfolio-section-label"><span>01 / THE WORK</span><span>{gallery.length.toString().padStart(2, "0")} MEDIA ITEMS</span></div>
      {gallery.length ? <div className="portfolio-detail-gallery">
        {gallery.map((url, index) => <Reveal key={url} className="portfolio-gallery-item">
          {isVideo(url) ? <video src={url} controls playsInline preload="metadata" aria-label={project.title + " media " + (index + 1)} /> : <img src={url} alt={project.title + (index ? " gallery image " + (index + 1) : " project cover")} loading={index === 0 ? "eager" : "lazy"} />}
        </Reveal>)}
      </div> : <div className="portfolio-coming-soon"><div className="portfolio-coming-index">LCH</div><div><span>PROJECT MEDIA</span><h2>Details are being prepared.</h2><p>Contact the studio if you would like to discuss work in this category.</p></div></div>}
      <div className="portfolio-project-story">
        <p className="studio-kicker"><span className="kicker-line" /> THE PROJECT / {project.category.toUpperCase()}</p>
        <h2>{project.title}</h2>
        <p>{project.description || project.summary || "A considered creative solution shaped around the brief and the audience."}</p>
        <div className="portfolio-detail-list"><div><span>DISCIPLINE</span><strong>{project.category}</strong></div><div><span>STUDIO</span><strong>Light Creative Hub</strong></div><div><span>APPROACH</span><strong>Purposeful, precise, distinctive</strong></div></div>
        <Link className="studio-button studio-button-blue" href={`/request-a-quote?service=${encodeURIComponent(project.category)}`}>Discuss a project like this <span>↗</span></Link>
      </div>
    </section>

    <section className="portfolio-cta-section"><div><p className="studio-kicker">HAVE A SIMILAR IDEA?</p><h2>Let’s make your next idea<br/><em>impossible to ignore.</em></h2></div><div><p>Tell us what you are building, launching or communicating.</p><Link className="studio-button studio-button-white" href="/request-a-quote">Start a project <span>↗</span></Link></div></section>
  </>;
}
