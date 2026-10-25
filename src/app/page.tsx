import { Reveal } from "@/components/creative-effects";
import { LiquidWorld } from "@/components/liquid-world";

const services = [
  { n: "01", title: "Brand identity", text: "Visual systems with clarity, character and staying power.", tag: "STRATEGY / DESIGN" },
  { n: "02", title: "Print & production", text: "Beautifully finished print, packaging and campaign materials.", tag: "PRINT / FINISH" },
  { n: "03", title: "Photography & film", text: "Images and moving stories built to make people feel something.", tag: "PHOTO / MOTION" },
  { n: "04", title: "Digital content", text: "Campaign assets and social-first creative made for real attention.", tag: "CONTENT / DIGITAL" }
];

export default function HomePage() {
  return <>
    <section className="hero hero-premium">
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-kicker"><span>INDEPENDENT CREATIVE STUDIO</span><span>LAGOS · NIGERIA / EST. FOR WHAT’S NEXT</span></div>
      <LiquidWorld />
      <div className="hero-main">
        <Reveal><p className="eyebrow">Ideas, made unmistakable.</p></Reveal>
        <h1 className="hero-title"><span>MAKE</span><br/><em>WAVES.</em></h1>
        <div className="hero-bottom"><p>We build brands, create imagery, print with precision and produce visual stories that move ideas forward.</p><div className="hero-actions"><a className="button button-light magnetic-link" href="/request-a-quote">Start a project <span>↗</span></a><a className="button button-outline" href="/portfolio">Explore our work <span>↘</span></a></div></div>
      </div>
      <div className="hero-index"><span>01 — 04</span><span>CREATIVE WITH INTENTION</span></div>
      <a className="scroll-cue" href="#intro"><span className="scroll-line" /> SCROLL TO EXPLORE</a>
    </section>
    <section className="intro-section" id="intro"><Reveal className="intro-label"><p className="eyebrow">LIGHT CREATIVE HUB / OUR POINT OF VIEW</p><span>01 — A CREATIVE PARTNER</span></Reveal><Reveal className="intro-statement"><h2>Good work gets noticed.<br/><em>Great work gets remembered.</em></h2><p>We bring design, print, photography, film and content together under one roof — making it easier to turn a good idea into something people can see, feel and remember.</p><a className="underlined-link" href="/about">Get to know us <span>↗</span></a></Reveal></section>
    <section className="section services-premium" id="services"><div className="section-heading"><div><p className="eyebrow">01 / WHAT WE MAKE</p><h2>From first thought<br/><span>to final form.</span></h2></div><p className="intro">One studio. A connected creative process. Every detail considered.</p></div><div className="premium-services">{services.map((s,i)=><Reveal key={s.n} delay={i*.07} className="premium-service"><span className="service-number">{s.n} / {s.tag}</span><div className="service-graphic" data-index={s.n}><span>{["✳","◒","◉","✳"][i]}</span><i /></div><div className="premium-service-copy"><h3>{s.title}</h3><p>{s.text}</p><a className="underlined-link" href="/services">Explore service <span>↗</span></a></div></Reveal>)}</div></section>
    <section className="portfolio-teaser"><div className="portfolio-teaser-head"><div><p className="eyebrow">02 / SELECTED DIRECTIONS</p><h2>Made to be<br/><em>seen differently.</em></h2></div><a className="button button-outline" href="/portfolio">View portfolio ↗</a></div><div className="editorial-grid"><a href="/portfolio" className="editorial-card editorial-large"><div className="editorial-art art-identity"><span className="art-orbit" /><strong>FORM<br/><i>FOLLOWS</i><br/>FEELING.</strong><small>IDENTITY SYSTEM / 001</small></div><div className="editorial-caption"><span>01 / BRAND IDENTITY</span><span>Concept direction ↗</span></div></a><a href="/portfolio" className="editorial-card"><div className="editorial-art art-print"><span className="print-disc">LCH<br/><small>PRINT STUDIO</small></span><strong>MAKE<br/>IT<br/><i>PHYSICAL.</i></strong><small>PRINT / MATERIAL / FINISH</small></div><div className="editorial-caption"><span>02 / PRINT & OBJECTS</span><span>Concept direction ↗</span></div></a><a href="/portfolio" className="editorial-card"><div className="editorial-art art-motion"><span className="motion-orb" /><strong>MOVE<br/>THE<br/><i>STORY.</i></strong><small>PHOTO / FILM / CONTENT</small></div><div className="editorial-caption"><span>03 / VISUAL STORIES</span><span>Concept direction ↗</span></div></a></div><p className="concept-note">Visuals shown are studio concept directions. Client case studies will be added as approved work is supplied.</p></section>
    <section className="process-section"><div className="process-intro"><p className="eyebrow">03 / HOW WE WORK</p><h2>Thoughtful by design.<br/><em>Precise by nature.</em></h2><p>Clear communication and considered craft from the first conversation to the final delivery.</p></div><div className="process-list"><Reveal><article><span>01</span><div><h3>Discover</h3><p>We listen, ask better questions and understand what success should look like.</p></div><span>↗</span></article></Reveal><Reveal delay={.08}><article><span>02</span><div><h3>Shape</h3><p>We turn the brief into a clear creative direction, with the right details in focus.</p></div><span>↗</span></article></Reveal><Reveal delay={.16}><article><span>03</span><div><h3>Make</h3><p>Design, production and finishing are handled with care and purpose.</p></div><span>↗</span></article></Reveal><Reveal delay={.24}><article><span>04</span><div><h3>Deliver</h3><p>We bring the work together, ready for the people it needs to reach.</p></div><span>↗</span></article></Reveal></div></section>
    <section className="contact-band contact-band-premium"><div><p className="eyebrow">04 / YOUR MOVE</p><h2>The next good idea<br/>could be <em>yours.</em></h2><p>Have a brief, a big idea or a deadline to meet? Let’s make something worth putting into the world.</p><a className="button button-dark" href="/request-a-quote">Tell us about it ↗</a></div><div className="contact-orbit" aria-hidden="true"><span>LET’S MAKE<br/>SOMETHING<br/><i>MATTER.</i></span></div></section>
  </>;
}
