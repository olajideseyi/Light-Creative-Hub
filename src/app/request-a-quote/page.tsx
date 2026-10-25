import type { Metadata } from "next";
import { PageIntro } from "@/components/creative-effects";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = { title: "Start a Project" };

export default function RequestQuotePage() {
  return <>
    <PageIntro eyebrow="START A PROJECT / YOUR BRIEF" title="Tell us what" accent="you have in mind." description="Give us the starting point. We’ll help shape the right creative approach, production plan and next steps."/>
    <section className="page-content quote-page">
      <div className="quote-layout">
        <div><p className="eyebrow">LET’S GET THE DETAILS</p><h2 className="quote-side-title">Every great thing<br/><em>starts somewhere.</em></h2><p className="intro">Tell us a little about your project, the service you need and any timing you have in mind. We’ll get back to you to discuss the best next step.</p><p className="quote-contact">Prefer a direct conversation? <a href="https://wa.me/2347067376478">Message us on WhatsApp ↗</a></p><p className="quote-contact">Or email <a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a></p></div>
        <QuoteForm />
      </div>
    </section>
  </>;
}
