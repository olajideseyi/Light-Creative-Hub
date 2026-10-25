import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = { title: "Start a Project | Light Creative Hub" };

export default function RequestQuotePage() {
  return <section className="section quote-page">
    <p className="eyebrow">START A PROJECT</p>
    <h1 className="quote-title">Tell us what<br/><em>you have in mind.</em></h1>
    <div className="quote-layout">
      <div><p className="intro">Share a few details and we’ll follow up to understand your needs, timing, and the best way to bring your idea to life.</p><p className="quote-contact">Prefer a direct conversation? <a href="https://wa.me/2347067376478">Message us on WhatsApp ↗</a></p></div>
      <QuoteForm />
    </div>
  </section>;
}
