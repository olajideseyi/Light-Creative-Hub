import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
function mediaIsVideo(url: string) { return /\\.(mp4|webm|mov|m4v)(\\?.*)?$/i.test(url); }

export default function HomePage() {
  return <>
    <section className="studio-hero">
      <div className="studio-hero-top"><span>INDEPENDENT CREATIVE STUDIO</span><span>LAGOS, NIGERIA · AVAILABLE FOR PROJECTS</span></div>
      <div className="studio-hero-main">
        <div className="studio-hero-copy">
          <p className="studio-kicker"><span className="kicker-line" /> BRAND STRATEGY / DESIGN / PRINT / VISUAL STORYTELLING</p>
          <h1>Make your<br/>brand <em>matter.</em></h1>
          <p className="studio-hero-intro">Light Creative Hub helps businesses and individuals turn ideas into clear identities, compelling design, quality print and visual stories people remember.</p>
          <div className="studio-hero-actions">
            <a className="studio-button studio-button-blue" href="/request-a-quote">Tell us about your project <span>↗</span></a>
            <a className="studio-button studio-button-outline" href="/portfolio">Explore selected work <span>↓</span></a>
          </div>
          <div className="studio-hero-proof"><span><b>01</b> STRATEGY & IDENTITY</span><span><b>02</b> DESIGN & PRINT</span><span><b>03</b> PHOTO & FILM</span></div>
        </div>
        <Reveal className="hero-artboard">
          <div className="artboard-ruler"><span>LIGHT CREATIVE HUB</span><span>BRAND / PRINT / DESIGN</span></div>
          <div className="artboard-main">
            <div className="artboard-icon" aria-label="Light Creative emblem"><svg viewBox="0 0 240 160" aria-hidden="true"><path d="M16 88C31 35 76 9 119 9L104 145C66 140 34 120 16 88Z" fill="currentColor"/><path d="M129 10L224 28C214 81 179 122 105 145Z" fill="currentColor"/><path d="M120 10L104 145" stroke="#fff" strokeWidth="6" fill="none"/><path d="m42 91 4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1zM190 39l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1z" fill="#fff"/></svg></div>
            <p className="artboard-name">Light Creative</p>
            <p className="artboard-tag">BRAND <i>|</i> <b>PRINT</b> <i>|</i> DESIGN</p>
          </div>
          <div className="artboard-bottom"><span>THOUGHTFUL BY DESIGN</span><span>LC—001 / CREATIVE PRACTICE</span></div>
          <div className="artboard-sticker sticker-orange">IDEA → IMPACT</div>
          <div className="artboard-sticker sticker-white">BUILT AROUND YOUR BRAND.</div>
        </Reveal>
      </div>
      <div className="studio-hero-bottom"><span>GOOD WORK STARTS WITH A GOOD CONVERSATION.</span><a href="#services">DISCOVER WHAT WE DO <span>↓</span></a></div>
    </section>

    <section className="studio-intro-section">
      <div className="studio-intro-label"><p className="studio-kicker">A CREATIVE PARTNER, NOT JUST A SUPPLIER</p><span>01 / THE APPROACH</span></div>
      <div className="studio-intro-content"><h2>Good design looks good.<br/><em>Great design does a job.</em></h2><div><p>Every colour, frame, word and printed detail should have a reason to be there. We bring creative thinking and practical execution together so the result is not only beautiful — it works for the people you need to reach.</p><a className="studio-inline-link" href="/about">Get to know the studio <span>↗</span></a></div></div>
    </section>

    <section className="studio-services" id="services">
      <div className="studio-section-top"><div><p className="studio-kicker">FROM FIRST IDEA TO FINAL DELIVERY</p><h2>What we bring<br/><em>to the table.</em></h2></div><p>Choose a service or bring us a challenge. We will help shape the right creative direction for your goal, audience and budget.</p></div>
      <div className="studio-service-grid">{services.map((service,i)=><Reveal key={service.n} delay={i*.035}><article className="studio-service-card"><div className="studio-service-top"><span>{service.n} / 06</span><span>{service.label}</span></div><div className={`studio-service-art service-art-${i+1}`} aria-hidden="true"><strong>{service.symbol}</strong><span>LIGHT CREATIVE HUB</span></div><h3>{service.title}</h3><p>{service.text}</p><a href="/services">Explore this service <span>↗</span></a></article></Reveal>)}</div>
      <div className="studio-services-foot"><span>BRANDING · GRAPHIC DESIGN · PRINT · PHOTO · FILM · COMMUNICATION</span><a href="/services">See all services ↗</a></div>
    </section>

    <section className="studio-work-section">
      <div className="studio-section-top"><div><p className="studio-kicker">THE PORTFOLIO</p><h2>Creative work,<br/><em>with a point of view.</em></h2></div><div className="studio-work-intro"><p>Explore visual directions across identity, campaign design and print. As approved client work is added, this collection becomes the studio’s living portfolio.</p><a className="studio-button studio-button-white" href="/portfolio">View the portfolio ↗</a></div></div>
      <div className="studio-work-grid">{projectCards.map((project,i)=>{const media=project.cover_image_url||(project.media_urls||[])[0]||"";return <Reveal key={project.id} delay={i*.06}><a href="/portfolio" className={`studio-work-card ${["work-brand","work-poster","work-print"][i%3]}`}><div className="studio-work-meta"><span>{String(i+1).padStart(2,"0")} / {project.category.toUpperCase()}</span><span>↗</span></div><div className="studio-work-art studio-work-art-live">{media?(mediaIsVideo(media)?<video src={media} muted playsInline preload="metadata" aria-label={project.title}/>:<img src={media} alt={project.title} loading="lazy"/>):<strong>{project.category}</strong>}</div><div className="studio-work-caption"><span>SELECTED WORK · {project.category.toUpperCase()}</span><h3>{project.title}</h3></div></a></Reveal>)}</div>{projectCards.length===0&&<div className="studio-work-empty"><span>THE PORTFOLIO IS READY FOR YOUR WORK</span><p>Approved featured projects will appear here as soon as they are published in the studio CMS.</p><a href="/portfolio">Explore the portfolio ↗</a></div>}
      <p className="studio-work-disclaimer">Only projects published and marked as featured in the studio CMS appear in this selection.</p>
    </section>

    <section className="studio-founder-section">
      <div className="founder-editorial founder-editorial-photo"><img src="https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg" alt="Founder portrait and service introduction for Light Creative Hub" loading="lazy"/><span>MEET THE CREATIVE / 001</span></div>
      <div className="founder-editorial-copy"><p className="studio-kicker">THE THINKING BEHIND THE WORK</p><h2>Give good ideas<br/>room to <em>become.</em></h2><blockquote>“Remember that creativity requires time and space. Allow yourself to recharge, seek inspiration from diverse sources, and let ideas marinate.”</blockquote><a className="studio-inline-link" href="/about">Meet the founder and studio <span>↗</span></a></div>
    </section>

    <section className="studio-contact-section"><div className="contact-section-copy"><p className="studio-kicker">HAVE SOMETHING IN MIND?</p><h2>Let’s make<br/><em>it memorable.</em></h2><p>Tell us what you want to build, launch, print or communicate. We’ll take it from there — one thoughtful step at a time.</p><div className="studio-contact-actions"><a className="studio-button studio-button-blue" href="/request-a-quote">Start a project <span>↗</span></a><a className="studio-button studio-button-whatsapp" href="https://wa.me/2347067376478?text=Hello%20Light%20Creative%20Hub%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> Chat on WhatsApp</a></div></div><div className="contact-info-panel"><span>LET’S TALK</span><a href="tel:+2347067376478">0706 737 6478</a><a href="tel:+2349045218491">0904 521 8491</a><a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a><small>BRAND · PRINT · DESIGN · VISUAL STORYTELLING</small></div></section>
  </>;
}
