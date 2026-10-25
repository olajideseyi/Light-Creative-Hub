import { Reveal } from "@/components/creative-effects";
import { LiquidWorld } from "@/components/liquid-world";

const services = [
  { n: "01", title: "Branding & re-branding", text: "Distinctive identities and consistent visual systems." },
  { n: "02", title: "Graphic design", text: "Flyers, campaigns, social content and business materials." },
  { n: "03", title: "Print & finishing", text: "Thoughtful design made tangible, from artwork to final print." },
  { n: "04", title: "Photography & videography", text: "People, products, events and stories captured with purpose." },
  { n: "05", title: "Data analysis", text: "Clear presentation and interpretation of information." },
  { n: "06", title: "PR & communications", text: "Public-facing messages with clarity and a consistent voice." },
];

export default function HomePage() {
  return <>
    <section className="lch-hero">
      <div className="lch-hero-bg" aria-hidden="true"><LiquidWorld /></div>
      <div className="lch-hero-top"><span>LIGHT CREATIVE HUB</span><span>BRAND / PRINT / DESIGN · NIGERIA</span></div>
      <div className="lch-hero-grid">
        <div className="lch-hero-copy">
          <Reveal><p className="lch-eyebrow"><span /> CREATIVE STUDIO · VISUAL COMMUNICATION</p></Reveal>
          <Reveal delay={.08}><h1>Ideas deserve<br/><em>to be seen.</em></h1></Reveal>
          <Reveal delay={.16}><p className="lch-hero-description">We build recognisable brands, design with purpose, produce print, and create photo and video content that helps your work stand out.</p></Reveal>
          <Reveal delay={.22}><div className="lch-hero-actions"><a className="lch-button lch-button-primary" href="/request-a-quote">Start a project <span>↗</span></a><a className="lch-text-link" href="/portfolio">Explore the portfolio <span>↗</span></a></div></Reveal>
          <div className="lch-hero-trust"><span>01 / BRAND IDENTITY</span><span>02 / PRINT & DESIGN</span><span>03 / PHOTO & FILM</span></div>
        </div>
        <Reveal className="lch-brand-composition" delay={.14}>
          <div className="lch-brand-card">
            <div className="lch-brand-card-top"><span>THE CREATIVE STUDIO</span><span>EST. FOR WHAT'S NEXT</span></div>
            <div className="lch-emblem" aria-hidden="true"><svg viewBox="0 0 240 160"><path d="M16 88C31 35 76 9 119 9L104 145C66 140 34 120 16 88Z" fill="currentColor"/><path d="M129 10L224 28C214 81 179 122 105 145Z" fill="currentColor"/><path d="M120 10L104 145" stroke="#fff" strokeWidth="6" fill="none"/><path d="M42 91l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1zM190 39l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1z" fill="#fff"/></svg></div>
            <div className="lch-brand-card-wordmark">Light Creative</div>
            <div className="lch-brand-card-tagline">BRAND <i>|</i> <b>PRINT</b> <i>|</i> DESIGN</div>
            <div className="lch-brand-card-bottom"><span>CLARITY IN EVERY DETAIL</span><span>LC / 001</span></div>
          </div>
          <div className="lch-floating-label lch-label-one"><span>✳</span> STRATEGY MEETS CRAFT</div>
          <div className="lch-floating-label lch-label-two">DESIGN · PRINT · STORY</div>
        </Reveal>
      </div>
      <div className="lch-hero-footer"><span>INDEPENDENT CREATIVE PRACTICE</span><a href="#studio">SCROLL TO DISCOVER <span>↓</span></a></div>
    </section>

    <section className="lch-founder" id="studio">
      <div className="lch-founder-mark"><span>MEET</span><strong>LIGHT.</strong><div className="lch-founder-symbol" aria-hidden="true">L<span>✳</span></div><small>FOUNDER · CREATIVE PRACTITIONER</small></div>
      <div className="lch-founder-copy"><p className="lch-eyebrow">THE PERSON BEHIND THE WORK</p><h2>Creativity needs<br/><em>time and space.</em></h2><blockquote>“Allow yourself to recharge, seek inspiration from diverse sources, and let ideas marinate.”</blockquote><p>Light Creative Hub brings together brand design, print, photography, videography and communication — with a thoughtful, practical approach to every brief.</p><a className="lch-text-link" href="/about">Meet the studio <span>↗</span></a></div>
    </section>

    <section className="lch-services">
      <div className="lch-section-heading"><div><p className="lch-eyebrow">WHAT WE CAN MAKE TOGETHER</p><h2>Creative services.<br/><em>Real-world purpose.</em></h2></div><p>From one standout design to a connected brand experience, the work is shaped around your goals.</p></div>
      <div className="lch-service-grid">{services.map((service, i) => <Reveal key={service.n} delay={i * .04}><article className="lch-service-card"><div className="lch-service-meta"><span>{service.n}</span><span>0{i + 1} / 06</span></div><div className="lch-service-symbol" aria-hidden="true">{["✳","◒","▤","◉","⌁","↗"][i]}</div><h3>{service.title}</h3><p>{service.text}</p><a href="/services" aria-label={`Explore ${service.title}`}>Explore service <span>↗</span></a></article></Reveal>)}</div>
      <div className="lch-service-bottom"><span>BRAND / PRINT / DESIGN / VISUAL STORIES</span><a href="/services">View all services ↗</a></div>
    </section>

    <section className="lch-portfolio">
      <div className="lch-section-heading"><div><p className="lch-eyebrow">A PLACE FOR THE WORK</p><h2>Built with care.<br/><em>Presented with pride.</em></h2></div><a className="lch-button lch-button-light" href="/portfolio">View portfolio ↗</a></div>
      <div className="lch-portfolio-grid">
        <a className="lch-project lch-project-blue" href="/portfolio"><span>01 / BRAND IDENTITY</span><div className="lch-project-mark"><div className="lch-project-symbol">◒</div><strong>Make your<br/><em>mark.</em></strong></div><small>VISUAL IDENTITY / CONCEPT DIRECTION</small></a>
        <a className="lch-project lch-project-paper" href="/portfolio"><span>02 / PRINT & DESIGN</span><div className="lch-print-stack"><b>IDEAS</b><b>INTO</b><b>OBJECTS.</b></div><small>PRINT / MATERIAL / FINISH</small></a>
        <a className="lch-project lch-project-black" href="/portfolio"><span>03 / VISUAL STORYTELLING</span><div className="lch-story-type">LOOK<br/>CLOSER<span>↗</span></div><small>PHOTO / FILM / CONTENT</small></a>
      </div>
      <p className="lch-portfolio-note">Concept directions are clearly labelled. Approved client projects can be added to the portfolio through the studio admin workspace.</p>
    </section>

    <section className="lch-contact-cta"><div><p className="lch-eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let's make it<br/><em>mean something.</em></h2><p>Tell us what you are building, launching, printing or trying to communicate.</p><div className="lch-hero-actions"><a className="lch-button lch-button-dark" href="/request-a-quote">Request a quote ↗</a><a className="lch-text-link" href="https://wa.me/2347067376478" target="_blank" rel="noreferrer">Chat on WhatsApp ↗</a></div></div><div className="lch-cta-orbit" aria-hidden="true"><span>MAKE<br/>IT<br/><i>MATTER.</i></span></div></section>
  </>;
}
