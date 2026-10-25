import type { Metadata } from "next";
import { PageIntro } from "@/components/creative-effects";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = { title: "Start a Project" };

export default function RequestQuotePage() {
  return <>
    <PageIntro eyebrow="START A PROJECT / YOUR BRIEF" title="Tell us what" accent="you have in mind." description="Share the essentials of your brief. We’ll use them to understand your goals and recommend an appropriate creative direction, scope and next steps."/>
    <section className="page-content quote-page">
      <div className="quote-layout">
        <div><p className="eyebrow">LET’S GET THE DETAILS</p><h2 className="quote-side-title">A clear brief<br/><em>starts the process.</em></h2><p className="intro">Describe the outcome you need, the service you’re considering and your preferred timeline. The studio will review your enquiry and follow up to discuss scope, timing and next steps.</p><p className="quote-contact">Prefer a direct conversation? <a href="https://wa.me/2347067376478">Message us on WhatsApp ↗</a></p><p className="quote-contact">Or email <a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a></p></div>
        <QuoteForm />
      </div>
    </section>
  </>;
}
