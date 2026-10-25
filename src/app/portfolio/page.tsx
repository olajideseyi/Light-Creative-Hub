import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Portfolio & Selected Work" };
const projects = [
{n:"01",category:"BRAND IDENTITY",title:"Form follows feeling.",desc:"A visual identity concept exploring expressive typography, bold colour and confident brand systems.",className:"art-identity",mark:"FORM",sub:"FOLLOWS FEELING."},
{n:"02",category:"PRINT & OBJECTS",title:"Make it physical.",desc:"A print direction built around material contrast, tactile details and memorable finishing.",className:"art-print",mark:"MAKE IT",sub:"PHYSICAL."},
{n:"03",category:"PHOTO / FILM",title:"Move the story.",desc:"A visual storytelling direction for brands that want to feel human, contemporary and clear.",className:"art-motion",mark:"MOVE",sub:"THE STORY."}
];
export default function PortfolioPage() {
 return <>
  <PageIntro eyebrow="THE WORK / PORTFOLIO" title="Work that gives" accent="ideas a form." description="A growing collection of creative directions across identity, print and visual storytelling. Real client case studies will be added as approved assets are ready."/>
  <section className="portfolio-page">
    <p className="eyebrow">SELECTED CREATIVE DIRECTIONS / 001—003</p><h2>Different formats.<br/><em>One clear point of view.</em></h2>
    <div className="portfolio-grid">{projects.map(p=><Reveal key={p.n} className="portfolio-project"><div className={`editorial-art ${p.className}`}><span className="project-index">{p.n} / LCH STUDIO</span><strong>{p.mark}<br/><i>{p.sub}</i></strong><small>{p.category}</small></div><div className="portfolio-project-copy"><span>{p.category}</span><h3>{p.title}</h3><p>{p.desc}</p></div></Reveal>)}</div>
    <p className="portfolio-note">Transparency note: these are original studio concept visuals used to demonstrate the creative direction of the site, not claims of completed client commissions. The admin workspace will let the team replace them with approved photographs, videos and case studies.</p>
    <div className="portfolio-end"><h2>Your project could be<br/><em>the next story.</em></h2><a className="button button-light" href="/request-a-quote">Work with us ↗</a></div>
  </section>
 </>;
}