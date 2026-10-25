import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Creative Services" };
const services = [
{ n:"01", title:"Brand identity & graphic design", intro:"A visual identity people can recognise and remember.", details:"Logo design and identity systems, brand guidelines, flyers, posters, event graphics, social media designs, business stationery, campaign key visuals and presentation layouts.", tags:"STRATEGY · IDENTITY · CAMPAIGNS" },
{ n:"02", title:"Printing & finishing", intro:"Design that becomes something tangible.", details:"Business cards, flyers, brochures, banners, promotional materials, document printing, lamination and other print-ready collateral. We help prepare artwork and coordinate the details that make the final piece feel considered.", tags:"PRINT · MATERIAL · FINISH" },
{ n:"03", title:"Photography & videography", intro:"Still and moving images with purpose and personality.", details:"Product and brand photography, event coverage, behind-the-scenes content, promotional videos, interviews, short-form social video, visual direction and edit-ready creative assets.", tags:"PHOTO · FILM · EDIT" },
{ n:"04", title:"Content production", intro:"A consistent visual voice across the places you show up.", details:"Social-first campaign assets, launch content, content day planning, creative concepts, visual storytelling and production support for people and brands that need to communicate clearly.", tags:"CONCEPT · CONTENT · DELIVERY" }
];
export default function ServicesPage() {
 return <>
  <PageIntro eyebrow="WHAT WE DO / SERVICES" title="From the first" accent="idea to impact." description="A connected set of creative services — designed to work together, or stand strong on their own."/>
  <section className="page-content"><div className="about-grid"><Reveal><p className="eyebrow">ONE PARTNER. MORE POSSIBILITIES.</p><h2>Creative thinking meets hands-on execution.</h2></Reveal><Reveal><p>Need one polished flyer, a full visual identity, a print run, or a campaign with photography and video? We shape the scope around your brief and your goals.</p><a className="underlined-link" href="/request-a-quote">Tell us what you need <span>↗</span></a></Reveal></div>
  <div className="service-detail-list">{services.map(s=><Reveal key={s.n}><article className="service-detail service-detail-expanded"><span>{s.n}</span><div><h3>{s.title}</h3><p className="service-tags">{s.tags}</p></div><div><p className="service-detail-intro">{s.intro}</p><p>{s.details}</p><a className="underlined-link" href={`/request-a-quote?service=${encodeURIComponent(s.title)}`}>Discuss this service <span>↗</span></a></div></article></Reveal>)}</div>
  <Reveal className="service-cta"><p className="eyebrow">HAVE A DIFFERENT BRIEF?</p><h2>Tell us what you’re<br/>trying to make.</h2><a className="button button-dark" href="/request-a-quote">Start a conversation ↗</a></Reveal></section>
 </>;
}