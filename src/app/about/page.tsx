import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About the Studio" };
export default function AboutPage() {
  return <>
    <PageIntro eyebrow="THE STUDIO / WHO WE ARE" title="Ideas with" accent="intention." description="Light Creative Hub is an independent creative studio connecting design, print and visual storytelling to help good ideas find their form."/>
    <section className="page-content">
      <div className="about-grid"><Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Creative is not decoration.<br/><span>It is how a message finds its power.</span></h2></Reveal><Reveal delay={.1}><p>We work with people, founders, growing businesses, organisations and individuals who care about how their work shows up in the world. We bring thoughtful creative direction and practical production together, so the idea and its execution feel connected.</p><p>From a first identity sketch to a finished printed piece, from a quiet product frame to a campaign that moves, we believe the small decisions make the big difference.</p><p>Our studio combines the visual with the tangible: brand thinking, design, print, photography, videography and digital content under one creative roof.</p></Reveal></div>
      <Reveal className="about-pullquote">“Make it clear. Make it considered. Make it matter.”</Reveal>
      <div className="service-detail-list">
        {[[ "01","Clarity before decoration","Every project begins with the audience, the message and the outcome — not just a trend." ],["02","Craft at every touchpoint","Typography, composition, materials, lighting, pacing and finishing all shape the experience."],["03","A connected creative process","One studio partner helps keep the idea consistent from the first conversation to final delivery."]].map(([n,t,d])=><Reveal key={n}><article className="service-detail"><span>{n}</span><h3>{t}</h3><p>{d}</p></article></Reveal>)}
      </div>
      <div style={{marginTop:60}}><a className="button button-dark" href="/request-a-quote">Let’s make something ↗</a></div>
    </section>
  </>;
}