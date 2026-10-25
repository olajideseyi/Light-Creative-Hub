import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
import { WhatsAppLink } from "@/components/whatsapp-float";
import { getSiteContact } from "@/lib/site-contact";
export const metadata: Metadata = { title: "Contact the Studio" };
export default function ContactPage() {
 return <>
  <PageIntro eyebrow="CONTACT / START HERE" title="Let’s make" accent="something matter." description="Share your project, timeline and goals. We’ll review the brief and recommend a clear next step."/>
  <section className="contact-page">
    <Reveal><p className="eyebrow">LET’S START WITH YOUR BRIEF</p><h2>What are you<br/>thinking about?<br/><em>Let’s talk.</em></h2><p>We work with businesses, organisations and individuals across Lagos and beyond. For project estimates, custom design, print production or creative collaborations, send a brief or contact the studio directly.</p><a className="button button-dark" href="/request-a-quote">Send a project brief ↗</a></Reveal>
    <Reveal delay={.1}><div className="contact-card"><p className="eyebrow">REACH THE STUDIO</p><WhatsAppLink><span>WHATSAPP / QUICK ENQUIRY</span>{siteContact.primaryPhone} ↗</WhatsAppLink><a href={"tel:"+siteContact.secondaryPhone.replaceAll(" ","").replaceAll("-","")}><span>PHONE / SECOND LINE</span>{siteContact.secondaryPhone} ↗</a><a href={"mailto:"+siteContact.email}><span>EMAIL / PROJECTS</span>{siteContact.email} ↗</a><a href="mailto:adeniyiboluwatife513@gmail.com"><span>EMAIL / ALTERNATE</span>adeniyiboluwatife513@gmail.com ↗</a><p className="contact-hours">Location: Lagos, Nigeria · Available for online and in-person projects by arrangement.</p></div></Reveal>
  </section>
 </>;
}