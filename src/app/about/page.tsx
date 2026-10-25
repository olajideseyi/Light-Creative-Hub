import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About the Studio" };

export default function AboutPage() {
  return <>
    <PageIntro eyebrow="THE STUDIO / WHO WE ARE" title="Ideas with" accent="intention." description="Light Creative Hub is an independent creative studio bringing brand identity, graphic design, print and visual storytelling together to help businesses communicate with clarity and distinction."/>
    <section className="page-content">
      <div className="about-grid">
        <Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Creative is not decoration.<br/><span>It is how a message finds its power.</span></h2></Reveal>
        <Reveal delay={.1}><p>We partner with founders, growing businesses, organisations and individuals to build a stronger, more consistent presence. Strategic thinking and hands-on production work side by side, so every decision supports the message.</p><p>From the first identity concept to the final printed piece, every detail matters. We consider the way an idea looks, feels and works across each point where people encounter it.</p><p>Our services include branding and rebranding, graphic design, print production, photography and videography, data presentation, public relations and communication support.</p></Reveal>
      </div>
      <Reveal className="about-founder-panel">
        <div className="about-founder-portrait"><img src="https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg" alt="Adeniyi Boluwatife, founder of Light Creative Hub" loading="lazy" /><span>FOUNDER / CREATIVE</span></div>
        <div><p className="eyebrow">MEET THE CREATIVE</p><h2>Adeniyi Boluwatife</h2><p>Founder · Light Creative Hub</p><blockquote>“Remember that creativity requires time and space. Allow yourself to recharge, seek inspiration from diverse sources, and let ideas marinate.”</blockquote></div>
      </Reveal>
      <Reveal className="about-pullquote">“Make it clear. Make it considered. Make it matter.”</Reveal>
      <div className="service-detail-list">
        {[
          ["01","Clarity before decoration","Every project begins with the audience, the message and the outcome — not just a trend."],
          ["02","Craft at every touchpoint","Typography, composition, materials, lighting, pacing and finishing all shape the experience."],
          ["03","A connected creative process","One studio partner helps keep the idea consistent from the first conversation to final delivery."]
        ].map(([n,t,d])=><Reveal key={n}><article className="service-detail"><span>{n}</span><h3>{t}</h3><p>{d}</p></article></Reveal>)}
      </div>
      <div style={{marginTop:60}}><a className="button button-dark" href="/request-a-quote">Discuss your project ↗</a></div>
    </section>
  </>;
}
