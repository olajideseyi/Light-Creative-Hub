import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact the Studio" };
export default function ContactPage() {
 return <>
  <PageIntro eyebrow="CONTACT / START HERE" title="Let’s make" accent="something matter." description="Share your project, timeline and goals. We’ll review the brief and recommend a clear next step."/>
  <section className="contact-page">
    <Reveal><p className="eyebrow">LET’S START WITH YOUR BRIEF</p><h2>What are you<br/>thinking about?<br/><em>Let’s talk.</em></h2><p>We work with businesses, organisations and individuals across Lagos and beyond. For project estimates, custom design, print production or creative collaborations, send a brief or contact the studio directly.</p><a className="button button-dark" href="/request-a-quote">Send a project brief ↗</a></Reveal>
    <Reveal delay={.1}><div className="contact-card"><p className="eyebrow">REACH THE STUDIO</p><a href="https://wa.me/2347067376478"><span>WHATSAPP / QUICK ENQUIRY</span>0706 737 6478 ↗</a><a href="tel:+2349045218491"><span>PHONE / SECOND LINE</span>0904 521 8491 ↗</a><a href="mailto:lightcreativehub0@gmail.com"><span>EMAIL / PROJECTS</span>lightcreativehub0@gmail.com ↗</a><a href="mailto:adeniyiboluwatife513@gmail.com"><span>EMAIL / ALTERNATE</span>adeniyiboluwatife513@gmail.com ↗</a><p className="contact-hours">Location: Lagos, Nigeria · Available for online and in-person projects by arrangement.</p></div></Reveal>
  </section>
 </>;
}