import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LiquidWorld } from "@/components/liquid-world";
import { WhatsAppLink } from "@/components/whatsapp-float";
import { getSiteContact } from "@/lib/site-contact";

const services = [
  { n: "01", title: "Brand identity & rebranding", text: "Logos, colour systems, typography and brand guidelines that make a business recognisable.", label: "IDENTITY SYSTEMS", symbol: "LC" },
  { n: "02", title: "Graphic design & campaigns", text: "Flyers, posters, social content, event graphics and marketing materials made to communicate clearly.", label: "CAMPAIGN DESIGN", symbol: "Aa" },
  { n: "03", title: "Printing & finishing", text: "Business cards, brochures, banners and print-ready materials, considered from artwork to final finish.", label: "PRINT / FINISH", symbol: "PRINT" },
  { n: "04", title: "Photography & videography", text: "People, products, events and brand stories captured with a clear point of view.", label: "PHOTO / FILM", symbol: "REC" },
  { n: "05", title: "Content & communications", text: "Visual content, public relations and messaging that help your brand show up consistently.", label: "STORY / VOICE", symbol: "STORY" },
  { n: "06", title: "Data analysis & presentation", text: "Information organised into clear reports and visual presentations that are easier to understand.", label: "INSIGHT / CLARITY", symbol: "DATA" },
];

type HomeProject = { id: string; title: string; slug: string; category: string; summary: string | null; cover_image_url: string | null; media_urls: string[] | null; featured: boolean; };
async function getHomeProjects(): Promise<HomeProject[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls,featured,display_order,created_at")
      .eq("published", true)
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) return [];
    return (data ?? []) as HomeProject[];
  } catch {
    return [];
  }
}
const showcaseProjects:HomeProject[]=[
{id:"reference-identity",title:"Identity & brand direction",slug:"identity-reference",category:"Brand Identity",summary:"A visual reference for thoughtful brand presentation.",cover_image_url:"https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1400&q=85",media_urls:[],featured:true},
{id:"reference-print",title:"Print, colour & composition",slug:"print-reference",category:"Print & Design",summary:"A temporary editorial image reference, ready to be replaced with approved studio work.",cover_image_url:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85",media_urls:[],featured:true},
{id:"reference-photo",title:"Photo & film production",slug:"photo-reference",category:"Photo & Film",summary:"A temporary visual reference for photography and film services.",cover_image_url:"https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85",media_urls:[],featured:true}
];
function mediaIsVideo(url: string) { return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url); }

type HomeContent = { heroEyebrow?:string; heroTitle?:string; heroDescription?:string; primaryCta?:string; secondaryCta?:string; approachTitle?:string; approachDescription?:string };
async function getHomeContent():Promise<HomeContent> {
  const fallback:HomeContent={heroEyebrow:"INDEPENDENT CREATIVE STUDIO",heroTitle:"A sharper look. A stronger brand.",heroDescription:"Light Creative Hub helps businesses and individuals turn ideas into clear identities, compelling design, quality print and visual stories people remember.",primaryCta:"Tell us about your project",secondaryCta:"Explore selected work",approachTitle:"Good design looks good. Great design does a job.",approachDescription:"Every colour, frame, word and printed detail should have a reason to be there. We bring creative thinking and practical execution together so the result is not only beautiful — it works for the people you need to reach."};
  try { const supabase=createSupabaseServerClient(); const {data,error}=await supabase.from("site_content").select("content_value").eq("content_key","homepage").maybeSingle(); if(error||!data?.content_value)return fallback; return {...fallback,...data.content_value} as HomeContent; } catch { return fallback; }
}
export default async function HomePage() {
  const [projectCards,homeContent,contact] = await Promise.all([getHomeProjects(),getHomeContent(),getSiteContact()]);
  const displayedProjects = projectCards.length ? projectCards : showcaseProjects;
  const heroLines=(homeContent.heroTitle||"Make your brand matter.").split(" ");
  return <>
    <section className="studio-hero">
      <div className="studio-hero-top"><span>{homeContent.heroEyebrow}</span><span>LAGOS, NIGERIA · AVAILABLE FOR PROJECTS</span></div>
      <div className="studio-hero-main">
        <div className="studio-hero-copy">
          <p className="studio-kicker"><span className="kicker-line" /> BRAND STRATEGY / DESIGN / PRINT / VISUAL STORYTELLING</p>
          <h1>{heroLines.slice(0,-1).join(" ")}<br/><em>{heroLines.slice(-1).join("")}</em></h1>
          <p className="studio-hero-intro">{homeContent.heroDescription}</p>
          <div className="studio-hero-actions">
            <a className="studio-button studio-button-blue" href="/request-a-quote">{homeContent.primaryCta} <span>↗</span></a>
            <a className="studio-button studio-button-outline" href="/portfolio">{homeContent.secondaryCta} <span>↓</span></a>
          </div>
          <div className="studio-hero-proof"><span><b>01</b><strong>Strategy & identity</strong><small>Positioning, logo and brand systems</small></span><span><b>02</b><strong>Design & print</strong><small>Campaigns, artwork and production</small></span><span><b>03</b><strong>Photo & film</strong><small>People, products and stories</small></span></div>
        </div>
        <Reveal className="hero-artboard hero-photo-collage">
          <div className="hero-collage-top"><span>LIGHT CREATIVE HUB</span><span>VISUAL STORIES / 001</span></div>
          <div className="hero-collage-main">
            <figure className="hero-collage-primary"><img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=85" alt="Colourful editorial graphic design and branding reference" loading="eager"/><figcaption><span>01 / BRAND DIRECTION</span><strong>Clarity in every detail.</strong></figcaption></figure>
            <figure className="hero-collage-secondary"><img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85" alt="Notebook and print design reference" loading="lazy"/><figcaption>02 / DESIGN & PRINT</figcaption></figure>
            <figure className="hero-collage-tertiary"><img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85" alt="Photographer creating a visual story" loading="lazy"/><figcaption>03 / PHOTO & FILM</figcaption></figure>
            <div className="hero-collage-note"><span>THOUGHTFUL CREATIVE PARTNERSHIP</span><strong>IDEA <i>→</i> IMPACT</strong></div>
          </div>
          <div className="hero-collage-bottom"><span>BRAND / PRINT / DESIGN / VISUAL STORYTELLING</span><span>MADE WITH PURPOSE ↗</span></div>
        </Reveal>
      </div>
      <div className="studio-hero-bottom"><span>GOOD WORK STARTS WITH A GOOD CONVERSATION.</span><a href="#services">DISCOVER WHAT WE DO <span>↓</span></a></div>
    </section>

    <section className="studio-intro-section">
      <div className="studio-intro-label"><p className="studio-kicker">A CREATIVE PARTNER, NOT JUST A SUPPLIER</p><span>01 / THE APPROACH</span></div>
      <div className="studio-intro-content"><h2>{(homeContent.approachTitle||"Good design looks good. Great design does a job.").split(". ")[0]}.<br/><em>{(homeContent.approachTitle||"Good design looks good. Great design does a job.").split(". ").slice(1).join(". ")}</em></h2><div><p>{homeContent.approachDescription}</p><a className="studio-inline-link" href="/about">Get to know the studio <span>↗</span></a></div></div>
    </section>

    <section className="studio-services" id="services">
      <div className="studio-section-top"><div><p className="studio-kicker">FROM FIRST IDEA TO FINAL DELIVERY</p><h2>What we bring<br/><em>to the table.</em></h2></div><p>Choose a service or bring us a challenge. We will help shape the right creative direction for your goal, audience and budget.</p></div>
      <div className="studio-service-grid">{services.map((service,i)=><Reveal key={service.n} delay={i*.035}><article className="studio-service-card"><div className="studio-service-top"><span>{service.n} / 06</span><span>{service.label}</span></div><div className={`studio-service-art service-art-${i+1}`} aria-hidden="true"><strong>{service.symbol}</strong><span>LIGHT CREATIVE HUB</span></div><h3>{service.title}</h3><p>{service.text}</p><a href="/services">Explore this service <span>↗</span></a></article></Reveal>)}</div>
      <div className="studio-services-foot"><span>BRANDING · GRAPHIC DESIGN · PRINT · PHOTO · FILM · COMMUNICATION</span><a href="/services">See all services ↗</a></div>
    </section>

    <section className="studio-work-section">
      <div className="studio-section-top"><div><p className="studio-kicker">THE PORTFOLIO</p><h2>Creative work,<br/><em>with a point of view.</em></h2></div><div className="studio-work-intro"><p>Explore selected identities, campaign visuals and print work—each chosen for its craft, clarity and ability to make a brand more memorable.</p><a className="studio-button studio-button-white" href="/portfolio">View the portfolio ↗</a></div></div>
      <div className="studio-work-grid">{displayedProjects.map((project,i)=>{const media=project.cover_image_url||(project.media_urls||[])[0]||"";return <Reveal key={project.id} delay={i*.06}><a href={project.id.startsWith("reference-") ? "/portfolio" : `/portfolio/${project.slug}`} className={`studio-work-card ${["work-brand","work-poster","work-print"][i%3]}`}><div className="studio-work-meta"><span>{String(i+1).padStart(2,"0")} / {project.category.toUpperCase()}</span><span>↗</span></div><div className="studio-work-art studio-work-art-live">{media?(mediaIsVideo(media)?<video src={media} muted playsInline preload="metadata" aria-label={project.title}/>:<img src={media} alt={project.title} loading="lazy"/>):<strong>{project.category}</strong>}</div><div className="studio-work-caption"><span>{project.id.startsWith("reference-")?"IMAGE REFERENCE · REPLACE IN CMS":"SELECTED WORK · "+project.category.toUpperCase()}</span><h3>{project.title}</h3></div></a></Reveal>})}</div>
      <p className="studio-work-disclaimer">{projectCards.length===0?"Temporary open-licence image references are shown until your own projects are published. Replace them anytime in the studio CMS.":"This selection updates from the studio CMS. Publish a project and mark it as featured to bring it into the spotlight."}</p>
    </section>

    <section className="studio-founder-section">
      <div className="founder-editorial founder-editorial-photo"><img src="https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg" alt="Founder portrait and service introduction for Light Creative Hub" loading="lazy"/><span>MEET THE CREATIVE / 001</span></div>
      <div className="founder-editorial-copy"><p className="studio-kicker">THE THINKING BEHIND THE WORK</p><h2>Give good ideas<br/>room to <em>become.</em></h2><blockquote>“Remember that creativity requires time and space. Allow yourself to recharge, seek inspiration from diverse sources, and let ideas marinate.”</blockquote><a className="studio-inline-link" href="/about">Meet the founder and studio <span>↗</span></a></div>
    </section>

    <section className="studio-contact-section"><div className="contact-section-copy"><p className="studio-kicker">HAVE SOMETHING IN MIND?</p><h2>Let’s make<br/><em>it memorable.</em></h2><p>Tell us what you want to build, launch, print or communicate. We’ll take it from there — one thoughtful step at a time.</p><div className="studio-contact-actions"><a className="studio-button studio-button-blue" href="/request-a-quote">Start a project <span>↗</span></a><WhatsAppLink className="studio-button studio-button-whatsapp"><span aria-hidden="true">↗</span> Chat on WhatsApp</WhatsAppLink></div></div><div className="contact-info-panel"><span>LET’S TALK</span><a href={"tel:"+contact.primaryPhone.replaceAll(" ","").replaceAll("-","")}>{contact.primaryPhone}</a><a href={"tel:"+contact.secondaryPhone.replaceAll(" ","").replaceAll("-","")}>{contact.secondaryPhone}</a><a href={"mailto:"+contact.email}>{contact.email}</a><small>BRAND · PRINT · DESIGN · VISUAL STORYTELLING</small></div></section>
  </>;
}
