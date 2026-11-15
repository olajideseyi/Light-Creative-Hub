import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WhatsAppLink } from "@/components/whatsapp-float";
import { SafeImage } from "@/components/safe-image";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { getSiteContact } from "@/lib/site-contact";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

type HomeProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  cover_image_url: string | null;
  media_urls: string[] | null;
  featured: boolean;
};

type HomeContent = {
  [key: string]: unknown;
  heroTitle?: string;
  heroDescription?: string;
  approachTitle?: string;
  approachDescription?: string;
  heroPrimaryImageUrl?: string;
  heroSlides?: string[];
  sections?: Array<{id:string;type:"cta"|"text";title:string;body:string;buttonLabel:string;buttonUrl:string}>;
  founderImageUrl?: string;
  founderTitle?: string;
  founderQuote?: string;
  contactEyebrow?: string;
  contactTitle?: string;
  contactDescription?: string;
  service1Title?: string;
  service1Description?: string;
  service2Title?: string;
  service2Description?: string;
  service3Title?: string;
  service3Description?: string;
};

const fallbackHeroImage = "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=2200&q=90";

type HeroSettings = { autoplay: boolean; intervalSeconds: number; transition: "crossfade" | "slide" | "wipe" | "none"; imageEffect: "float" | "parallax" | "zoom" | "static"; motionEnabled: boolean; showArrows: boolean; showDots: boolean };
const defaultHeroSettings: HeroSettings = { autoplay: true, intervalSeconds: 3, transition: "crossfade", imageEffect: "zoom", motionEnabled: true, showArrows: true, showDots: true };

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("site_content").select("content_value").eq("content_key", "effects").maybeSingle();
    if (error || !data?.content_value) return defaultHeroSettings;
    const value = data.content_value as Record<string, unknown>;
    const transitions = ["crossfade", "slide", "wipe", "none"];
    const imageEffects = ["float", "parallax", "zoom", "static"];
    return {
      autoplay: value.carouselAutoplay !== false,
      intervalSeconds: Math.min(15, Math.max(2, Number(value.carouselIntervalSeconds) || 3)),
      transition: transitions.includes(String(value.transition)) ? value.transition as HeroSettings["transition"] : defaultHeroSettings.transition,
      imageEffect: imageEffects.includes(String(value.imageEffect)) ? value.imageEffect as HeroSettings["imageEffect"] : defaultHeroSettings.imageEffect,
      motionEnabled: value.motionEnabled !== false,
      showArrows: value.carouselArrows !== false,
      showDots: value.carouselDots !== false
    };
  } catch { return defaultHeroSettings; }
}

const referenceProjects: HomeProject[] = [
  { id: "reference-identity", title: "Identity & brand direction", slug: "identity-reference", category: "Brand identity", summary: "A visual reference for considered identity work.", cover_image_url: "https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1400&q=85", media_urls: [], featured: true },
  { id: "reference-print", title: "Print, colour & composition", slug: "print-reference", category: "Design & print", summary: "A visual reference for print and editorial design.", cover_image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85", media_urls: [], featured: true },
  { id: "reference-film", title: "Photo & film production", slug: "film-reference", category: "Photo & film", summary: "A visual reference for photography and moving image.", cover_image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85", media_urls: [], featured: true }
];

async function getHomeProjects(): Promise<HomeProject[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls,featured,display_order,created_at")
      .eq("published", true).eq("featured", true)
      .order("display_order", { ascending: true }).order("created_at", { ascending: false }).limit(3);
    if (error) return [];
    return (data ?? []) as HomeProject[];
  } catch { return []; }
}

async function getHomeContent(): Promise<HomeContent> {
  const fallback: HomeContent = {
    heroTitle: "Creative work that moves brands forward.",
    heroDescription: "Brand identity, design, print and visual content—brought together with a clear point of view and careful execution.",
    approachTitle: "Good work starts with a clear idea.",
    approachDescription: "We take time to understand the business, the audience and the message. Then we shape the right visual response, from the first sketch to the final production.",
    heroPrimaryImageUrl: fallbackHeroImage,
    founderImageUrl: "https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg",
    founderTitle: "Thoughtful ideas. Excellent execution.",
    founderQuote: "Every detail should work together: the message, the design and the way people experience the brand.",
    contactEyebrow: "HAVE A PROJECT IN MIND?",
    contactTitle: "Let's make your next idea happen.",
    contactDescription: "Tell us what you are building. We will help turn the brief into clear, considered creative work.",
    service1Title: "Brand identity & design",
    service1Description: "Brand strategy, logo design, identity systems and campaign artwork that give your business a recognisable presence.",
    service2Title: "Print & production",
    service2Description: "Business stationery, brochures, flyers, signage and campaign materials, prepared carefully from screen to final finish.",
    service3Title: "Photography & film",
    service3Description: "Brand, product and event photography, promotional video and social content with a clear visual story."
  };
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("site_content").select("content_value").eq("content_key", "homepage").maybeSingle();
    if (error || !data?.content_value) return fallback;
    return { ...fallback, ...data.content_value } as HomeContent;
  } catch { return fallback; }
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export default async function HomePage() {
  const [projects, content, contact, heroSettings] = await Promise.all([getHomeProjects(), getHomeContent(), getSiteContact(), getHeroSettings()]);
  const selectedProjects = projects.length ? projects : referenceProjects;
  const isReferenceSet = projects.length === 0;
  const services = [
    { number: "01", title: content.service1Title || "Brand identity & design", description: content.service1Description || "", image: "https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1200&q=85", alt: "Brand identity and visual design materials" },
    { number: "02", title: content.service2Title || "Print & production", description: content.service2Description || "", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85", alt: "Printed editorial and stationery materials" },
    { number: "03", title: content.service3Title || "Photography & film", description: content.service3Description || "", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85", alt: "Photography production in a studio" }
  ];
  const approachTitle = content.approachTitle || "Good work starts with a clear idea.";
  const contactTitle = content.contactTitle || "Let's make your next idea happen.";

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <HomeHeroCarousel images={content.heroSlides?.length ? content.heroSlides : [content.heroPrimaryImageUrl || fallbackHeroImage]} fallbackImage={fallbackHeroImage} settings={heroSettings} />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}><span /> LIGHT CREATIVE HUB <span className={styles.eyebrowRule} /> BRAND · DESIGN · PRINT · FILM</p>
          <h1 id="home-title">{content.heroTitle || "Creative work that moves brands forward."}</h1>
          <p className={styles.heroIntro}>{content.heroDescription}</p>
          <div className={styles.heroActions}>
            <a className={styles.buttonPrimary} href="/request-a-quote">Start a project <span>↗</span></a>
            <a className={styles.buttonSecondary} href="/portfolio">Explore our work <span>↗</span></a>
          </div>
        </div>
        <div className={styles.heroFoot}>
          <span>CREATIVE THINKING / PRECISE EXECUTION</span>
          <a href="#studio-approach">SCROLL TO EXPLORE <span>↓</span></a>
        </div>
      </section>

      <section className={styles.statement} id="studio-approach">
        <div className={styles.sectionTop}><span>01 — OUR APPROACH</span><span>THOUGHTFUL BY DESIGN</span></div>
        <div className={styles.statementGrid}>
          <h2>{approachTitle}</h2>
          <div className={styles.statementText}>
            <p>{content.approachDescription}</p>
            <a className={styles.textLink} href="/about">Get to know the studio <span>↗</span></a>
          </div>
        </div>
      </section>

      <section className={styles.services} aria-labelledby="services-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>WHAT WE DO</p><h2 id="services-title">One studio.<br /><em>Many ways to make an impact.</em></h2></div>
          <p>From the first idea to the finished piece, we bring the right creative skills together to help your business show up with confidence.</p>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(service => (
            <Reveal key={service.number} className={styles.serviceCard}>
              <a className={styles.serviceImage} href="/services">
                <SafeImage src={service.image} fallbackSrc={fallbackHeroImage} alt={service.alt} />
                <span>{service.number} / DISCIPLINE</span><b>↗</b>
              </a>
              <div className={styles.serviceBody}>
                <span className={styles.cardIndex}>LIGHT CREATIVE HUB / {service.number}</span>
                <h3>{service.title}</h3><p>{service.description}</p>
                <a className={styles.textLink} href="/services">Explore service <span>↗</span></a>
              </div>
            </Reveal>
          ))}
        </div>
        <div className={styles.sectionFoot}><span>STRATEGY · DESIGN · PRODUCTION · STORYTELLING</span><a href="/services">VIEW ALL SERVICES ↗</a></div>
      </section>

      <section className={styles.work} aria-labelledby="work-title">
        <div className={styles.workHeading}>
          <div><p className={styles.kicker}>SELECTED WORK</p><h2 id="work-title">A closer look at<br /><em>what we create.</em></h2></div>
          <div><p>Selected projects and visual references across identity, design, print and image-making.</p><a className={styles.workButton} href="/portfolio">View the portfolio <span>↗</span></a></div>
        </div>
        <div className={styles.projectGrid}>
          {selectedProjects.map((project, index) => {
            const media = project.cover_image_url || project.media_urls?.[0] || "";
            return <Reveal key={project.id} className={styles.projectCard}>
              <a href={project.id.startsWith("reference-") ? "/portfolio" : "/portfolio/" + project.slug}>
                <div className={styles.projectImage}>
                  {media && (isVideo(media) ? <video src={media} muted playsInline preload="metadata" aria-label={project.title} /> : <SafeImage src={media} fallbackSrc={fallbackHeroImage} alt={project.title} />)}
                  <span>{String(index + 1).padStart(2, "0")} / {(project.category || "CREATIVE").toUpperCase()}</span><b>↗</b>
                </div>
                <div className={styles.projectCaption}><div><small>{isReferenceSet ? "VISUAL REFERENCE" : "PUBLISHED PROJECT"}</small><h3>{project.title}</h3></div><p>{project.summary || "Creative direction and considered execution."}</p></div>
              </a>
            </Reveal>;
          })}
        </div>
        {isReferenceSet && <p className={styles.referenceNote}>Temporary visual references are shown until published studio projects are added through the CMS.</p>}
        <div className={styles.sectionFoot}><span>FORM · FUNCTION · FEELING</span><a href="/portfolio">OPEN THE PROJECT ARCHIVE ↗</a></div>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutImage}>
          <SafeImage src={content.founderImageUrl} alt="Founder and creative lead at Light Creative Hub" />
          <span>THE PEOPLE BEHIND THE WORK</span>
        </div>
        <div className={styles.aboutCopy}>
          <p className={styles.kicker}>A CREATIVE PARTNER, NOT JUST A SUPPLIER</p>
          <h2>{content.founderTitle || "Thoughtful ideas. Excellent execution."}</h2>
          <blockquote>“{content.founderQuote || "Every detail should work together: the message, the design and the way people experience the brand."}”</blockquote>
          <p>We work closely with businesses, organisations and individuals, bringing the thinking and making together so every detail supports the bigger picture.</p>
          <a className={styles.textLink} href="/about">Meet the studio <span>↗</span></a>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.contactCopy}>
          <p className={styles.kicker}>{content.contactEyebrow || "HAVE A PROJECT IN MIND?"}</p>
          <h2>{contactTitle}</h2>
          <p>{content.contactDescription}</p>
          <div className={styles.contactActions}>
            <a className={styles.buttonPrimary} href="/request-a-quote">Tell us about your project <span>↗</span></a>
            <WhatsAppLink className={styles.whatsapp}>WhatsApp enquiry <span>↗</span></WhatsAppLink>
          </div>
        </div>
        <div className={styles.contactDetails}>
          <span>CONTACT THE STUDIO</span>
          <a href={"tel:" + contact.primaryPhone.replaceAll(" ", "").replaceAll("-", "")}>{contact.primaryPhone}</a>
          <a href={"tel:" + contact.secondaryPhone.replaceAll(" ", "").replaceAll("-", "")}>{contact.secondaryPhone}</a>
          <a href={"mailto:" + contact.email}>{contact.email}</a>
          <small>LAGOS, NIGERIA · ONLINE & IN-PERSON BY ARRANGEMENT</small>
        </div>
      </section>
      {(content.sections??[]).map((section,index)=><section className={section.type==="cta"?styles.cmsCtaSection:styles.cmsTextSection} key={section.id}><div><span>{section.type==="cta"?"LET'S WORK TOGETHER":"LIGHT CREATIVE HUB / "+String(index+1).padStart(2,"0")}</span><h2>{section.title}</h2><p>{section.body}</p>{section.buttonLabel&&<a href={section.buttonUrl||"/request-a-quote"}>{section.buttonLabel} <b>↗</b></a>}</div></section>)}
    </div>
  );
}
