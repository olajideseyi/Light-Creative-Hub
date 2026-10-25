import type { Metadata } from "next";
import { PageIntro, Reveal } from "@/components/creative-effects";
export const metadata: Metadata = { title:"Privacy",description:"Learn how Light Creative Hub handles information submitted through its project enquiry forms.",robots:{index:true,follow:true},openGraph:{title:"Privacy | Light Creative Hub",description:"How project enquiry information is handled.",type:"website"} };
export default function PrivacyPage() {
 return <>
  <PageIntro eyebrow="PRIVACY / YOUR INFORMATION" title="Respect by" accent="design." description="We only ask for the information needed to understand your enquiry and communicate with you about your project."/>
  <section className="page-content privacy-content"><Reveal><p className="eyebrow">HOW ENQUIRY DATA IS USED</p><h2>Clear purpose.<br/><span>Considered handling.</span></h2></Reveal><Reveal className="privacy-copy"><p>When you submit an enquiry, Light Creative Hub uses the information you provide to understand your request and respond to you.</p><p>We do not ask you to submit passwords or payment card details through the enquiry form. Please share only information needed to discuss your project.</p><p>Enquiry information is stored in our project database so we can manage and respond to requests. We limit the form to project-related information and use access controls to protect the records.</p><p>For privacy questions or requests relating to an enquiry, contact <a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a>.</p><p className="privacy-note">This page describes the current enquiry workflow and should be reviewed alongside the studio’s final data-retention practices before public launch.</p></Reveal></section>
 </>;
}
