import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About the Studio" };

export default function AboutPage() {
  return <>
    <PageIntro eyebrow="THE STUDIO / WHO WE ARE" title="Ideas with" accent="intention." description="Light Creative Hub is a creative practice built around brand identity, print, visual storytelling and clear communication — bringing ideas into focus and giving them a form people can recognise."/>
    <section className="page-content">
      <div className="about-grid">
        <Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Creative is not decoration.<br/><span>It is how a message finds its power.</span></h2></Reveal>
        <Reveal delay={.1}><p>We work with founders, growing businesses, organisations and individuals who care about how their work shows up in the world. We bring thoughtful creative direction and practical production together, so the idea and its execution feel connected.</p><p>From a first identity sketch to a finished printed piece, from a product frame to a campaign that moves, we believe the small decisions make the big difference.</p><p>Our services span branding and re-branding, graphic design, printing, mobile photography and videography, data analysis, public relations and communication support.</p></Reveal>
      </div>
      <Reveal className="about-founder-panel">
        <div className="about-founder-monogram" aria-hidden="true"><span>L</span><i>✳</i></div>
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
      <div style={{marginTop:60}}><a className="button button-dark" href="/request-a-quote">Let’s make something ↗</a></div>
    </section>
  </>;
}
