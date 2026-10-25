import { PageIntro, Reveal } from "@/components/creative-effects";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export const metadata: Metadata = { title:"About the Studio",description:"Meet Light Creative Hub, an independent creative studio connecting brand strategy, design, print and visual storytelling.",openGraph:{title:"About Light Creative Hub",description:"A creative studio for purposeful identity, design and visual communication.",type:"website"} };

type AboutContent={eyebrow?:string;title?:string;description?:string;founderQuote?:string};
async function getAboutContent():Promise<AboutContent>{
 const fallback:AboutContent={eyebrow:"THE STUDIO / WHO WE ARE",title:"A studio with a point of view.",description:"We build distinctive brand identities and visual communication for businesses ready to present themselves with clarity, confidence and consistency. From the first strategic conversation to the finished design or printed piece, our focus is work that looks considered and serves a clear purpose.",founderQuote:"The best creative work gives an idea room to breathe—and gives the audience a clear reason to care."};
 try{const supabase=createSupabaseServerClient();const {data,error}=await supabase.from("site_content").select("content_value").eq("content_key","about").maybeSingle();if(error||!data?.content_value)return fallback;return {...fallback,...data.content_value} as AboutContent;}catch{return fallback;}
}
export default async function AboutPage() {
 const content=await getAboutContent();
 const titleParts=(content.title||"A studio with a point of view.").split(" ");
 return <>
    <PageIntro eyebrow={content.eyebrow||"THE STUDIO / WHO WE ARE"} title={titleParts.slice(0,3).join(" ")} accent={titleParts.slice(3).join(" ")} description={content.description||""}/>
    <section className="page-content">
      <div className="about-grid">
        <Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Good creative work does more than look good.<br/><span>It gives people a reason to notice, understand and remember.</span></h2></Reveal>
        <Reveal delay={.1}><p>We partner with founders, growing businesses and organisations to make their value easier to see and understand. Each project starts with the audience, the message and the outcome—not a template or a passing trend.</p><p>We bring strategy, design and production into one connected process. Typography, colour, imagery, materials and finishing are treated as parts of the same story, so the final result feels coherent at every touchpoint.</p><p>Our work spans brand identity and rebranding, graphic design, print production, photography and videography, data presentation, and communication support. We shape each engagement around what you need to say, who needs to hear it and where the work needs to live.</p></Reveal>
      </div>
      <Reveal className="about-founder-panel">
        <div className="about-founder-portrait"><img src="https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg" alt="Adeniyi Boluwatife, founder of Light Creative Hub" loading="lazy" /><span>FOUNDER / CREATIVE</span></div>
        <div><p className="eyebrow">MEET THE CREATIVE</p><h2>Adeniyi Boluwatife</h2><p>Founder · Light Creative Hub</p><blockquote>“{content.founderQuote||"The best creative work gives an idea room to breathe—and gives the audience a clear reason to care."}”</blockquote></div>
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
