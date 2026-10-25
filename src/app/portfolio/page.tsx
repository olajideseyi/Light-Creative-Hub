import { PageIntro, Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Portfolio & Selected Work" };
export const revalidate = 60;

const concepts = [
{n:"01",category:"BRAND IDENTITY",title:"Form follows feeling.",desc:"A visual identity concept exploring expressive typography, bold colour and confident brand systems.",className:"art-identity",mark:"FORM",sub:"FOLLOWS FEELING."},
{n:"02",category:"PRINT & OBJECTS",title:"Make it physical.",desc:"A print direction built around material contrast, tactile details and memorable finishing.",className:"art-print",mark:"MAKE IT",sub:"PHYSICAL."},
{n:"03",category:"PHOTO / FILM",title:"Move the story.",desc:"A visual storytelling direction for brands that want to feel human, contemporary and clear.",className:"art-motion",mark:"MOVE",sub:"THE STORY."}
];

async function getPublishedProjects() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls,featured,display_order")
      .eq("published", true).order("featured", { ascending: false })
      .order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch { return []; }
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export default async function PortfolioPage() {
 const projects = await getPublishedProjects();
 return <>
  <PageIntro eyebrow="THE WORK / PORTFOLIO" title="Work that gives" accent="ideas a form." description="A growing collection of creative directions across identity, print and visual storytelling. Approved work uploaded by the studio appears here automatically."/>
  <section className="portfolio-page">
    <p className="eyebrow">SELECTED WORK / {projects.length ? "LIVE PROJECTS" : "STUDIO DIRECTIONS"}</p>
    <h2>{projects.length ? <>Ideas, brought<br/><em>into the world.</em></> : <>Different formats.<br/><em>One clear point of view.</em></>}</h2>
    {projects.length ? <div className="portfolio-grid">{projects.map((p, index) => {
      const cover = p.cover_image_url as string | null;
      const video = cover ? isVideo(cover) : false;
      return <Reveal key={p.id} className="portfolio-project live-portfolio-project">
        <div className="live-project-media">
          {cover ? (video ? <video src={cover} controls playsInline preload="metadata" aria-label={p.title} /> : <img src={cover} alt={p.title} loading={index < 2 ? "eager" : "lazy"} />) : <div className={`editorial-art ${index % 3 === 0 ? "art-identity" : index % 3 === 1 ? "art-print" : "art-motion"}`}><strong>{p.title}</strong></div>}
          {p.featured && <span className="featured-tag">FEATURED PROJECT</span>}
        </div>
        <div className="portfolio-project-copy"><span>{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p></div>
      </Reveal>;
    })}</div> : <div className="portfolio-grid">{concepts.map(p=><Reveal key={p.n} className="portfolio-project"><div className={`editorial-art ${p.className}`}><span className="project-index">{p.n} / LCH STUDIO</span><strong>{p.mark}<br/><i>{p.sub}</i></strong><small>{p.category}</small></div><div className="portfolio-project-copy"><span>{p.category}</span><h3>{p.title}</h3><p>{p.desc}</p></div></Reveal>)}</div>}
    {!projects.length && <p className="portfolio-note">These are original studio concept visuals used to demonstrate the site’s creative direction, not claims of completed client commissions. Once approved projects are published from the admin workspace, they will automatically replace this concept gallery.</p>}
    <div className="portfolio-end"><h2>Your project could be<br/><em>the next story.</em></h2><a className="button button-light" href="/request-a-quote">Work with us ↗</a></div>
  </section>
 </>;
}
