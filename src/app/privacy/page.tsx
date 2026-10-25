import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
 return <section className="section"><p className="eyebrow">PRIVACY</p><h1 className="privacy-title">Your information.<br/><em>Handled with care.</em></h1><div className="privacy-copy"><p>When you submit an enquiry, Light Creative Hub uses the information you provide to understand your request and respond to you.</p><p>We do not ask you to submit passwords or payment card details through the enquiry form. Please share only information needed to discuss your project.</p><p>Enquiry information is stored in our project database so we can manage and respond to requests. Access controls and retention practices should be reviewed before the site launches publicly.</p><p>For privacy questions, contact <a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a>.</p></div></section>;
}
