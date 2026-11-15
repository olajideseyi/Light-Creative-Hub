import { Reveal } from "@/components/creative-effects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WhatsAppLink } from "@/components/whatsapp-float";
import { getSiteContact } from "@/lib/site-contact";
import styles from "./home.module.css";

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
  [key: string]: string | undefined;
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  primaryCta?: string;
  secondaryCta?: string;
  approachTitle?: string;
  approachDescription?: string;
  heroPrimaryImageUrl?: string;
  heroSecondaryImageUrl?: string;
  heroTertiaryImageUrl?: string;
  founderImageUrl?: string;
  founderTitle?: string;
  founderQuote?: string;
  contactEyebrow?: string;
  contactTitle?: string;
  contactDescription?: string;
};

const referenceProjects: HomeProject[] = [
  {
    id: "reference-identity",
    title: "Identity & brand direction",
    slug: "identity-reference",
    category: "Brand identity",
    summary: "A visual reference for considered identity work.",
    cover_image_url: "https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1400&q=85",
    media_urls: [],
    featured: true
  },
  {
    id: "reference-print",
    title: "Print, colour & composition",
    slug: "print-reference",
    category: "Design & print",
    summary: "A visual reference for print and editorial design.",
    cover_image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85",
    media_urls: [],
    featured: true
  },
  {
    id: "reference-film",
    title: "Photo & film production",
    slug: "film-reference",
    category: "Photo & film",
    summary: "A visual reference for photography and moving image.",
    cover_image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85",
    media_urls: [],
    featured: true
  }
];

async function getHomeProjects(): Promise<HomeProject[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,media_urls,featured,display_order,created_at")
      .eq("published", true)
      .eq("featured", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) return [];
    return (data ?? []) as HomeProject[];
  } catch {
    return [];
  }
}

async function getHomeContent(): Promise<HomeContent> {
  const fallback: HomeContent = {
    heroEyebrow: "INDEPENDENT CREATIVE STUDIO · LAGOS",
    heroTitle: "Ideas with purpose. Work with impact.",
    heroDescription: "We bring brand thinking, design and production together to help businesses communicate with clarity — from the first idea to the finished piece.",
    primaryCta: "Start a conversation",
    secondaryCta: "Explore selected work",
    approachTitle: "Good work begins with understanding.",
    approachDescription: "Before choosing a colour, frame or typeface, we get clear on what needs to be said and who needs to hear it. That thinking gives the creative work direction — and gives the final result a job to do.",
    heroPrimaryImageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=88",
    heroSecondaryImageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
    heroTertiaryImageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85",
    founderImageUrl: "https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg",
    founderTitle: "Creative thinking. Careful execution.",
    founderQuote: "The best creative work gives an idea room to breathe — and gives the audience a clear reason to care.",
    contactEyebrow: "HAVE A PROJECT IN MIND?",
    contactTitle: "Let's make something that matters.",
    contactDescription: "Whether you are building a brand, preparing a campaign or telling a story, we would like to hear what you have in mind.",
    service1Title: "Strategy & identity",
    service1Description: "Brand positioning, naming direction, logo design and identity systems that give your business a recognisable point of view.",
    service2Title: "Design & print",
    service2Description: "Campaign artwork, marketing materials, stationery and print production, prepared with care from screen to final finish.",
    service3Title: "Photo & film",
    service3Description: "Brand, product and event photography, promotional video and social content shaped around a clear story."
  };

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("site_content")
      .select("content_value")
      .eq("content_key", "homepage")
      .maybeSingle();
    if (error || !data?.content_value) return fallback;
    return { ...fallback, ...data.content_value } as HomeContent;
  } catch {
    return fallback;
  }
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export default async function HomePage() {
  const [projects, content, contact] = await Promise.all([
    getHomeProjects(),
    getHomeContent(),
    getSiteContact()
  ]);
  const selectedProjects = projects.length ? projects : referenceProjects;
  const titleParts = (content.heroTitle || "Ideas with purpose. Work with impact.").split(". ");
  const approachParts = (content.approachTitle || "Good work begins with understanding.").split(". ");
  const contactParts = (content.contactTitle || "Let's make something that matters.").split(" ");
  const isReferenceSet = projects.length === 0;

  const serviceCards = [
    {
      number: "01",
      title: content.service1Title || "Strategy & identity",
      description: content.service1Description || "Brand positioning, naming direction, logo design and identity systems that give your business a recognisable point of view.",
      image: "https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1000&q=85",
      alt: "Brand identity and printed design materials",
      href: "/services#strategy-identity"
    },
    {
      number: "02",
      title: content.service2Title || "Design & print",
      description: content.service2Description || "Campaign artwork, marketing materials, stationery and print production, prepared with care from screen to final finish.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85",
      alt: "Printed editorial and stationery materials",
      href: "/services#print-design"
    },
    {
      number: "03",
      title: content.service3Title || "Photo & film",
      description: content.service3Description || "Brand, product and event photography, promotional video and social content shaped around a clear story.",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=85",
      alt: "Photographer working on a visual production",
      href: "/services#photo-film"
    }
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroMeta}>
          <span>{content.heroEyebrow}</span>
          <span>BRAND / DESIGN / PRINT / IMAGE</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><i /> CREATIVE IDEAS. PROFESSIONAL EXECUTION.</p>
            <h1 id="home-title">
              <span>{titleParts[0]}{titleParts.length > 1 ? "." : ""}</span>
              {titleParts.length > 1 && <em>{titleParts.slice(1).join(". ")}</em>}
            </h1>
            <p className={styles.heroIntro}>{content.heroDescription}</p>
            <div className={styles.heroActions}>
              <a className={styles.buttonPrimary} href="/request-a-quote">{content.primaryCta}<span>↗</span></a>
              <a className={styles.buttonText} href="/portfolio">{content.secondaryCta}<span>↓</span></a>
            </div>
            <div className={styles.heroFootnote}>
              <span>01 — 03</span>
              <p>One connected creative partner, from the first conversation to final delivery.</p>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageMain}>
              <img src={content.heroPrimaryImageUrl || ""} alt="Colour, typography and visual identity work on a studio desk" fetchPriority="high" />
              <span className={styles.imageLabel}>LIGHT CREATIVE HUB <b>—</b> LAGOS</span>
            </div>
            <div className={styles.heroImageDetail}>
              <img src={content.heroSecondaryImageUrl || ""} alt="Printed editorial material and stationery" loading="lazy" />
              <span>PRINT / DETAIL</span>
            </div>
            <div className={styles.heroImageFilm}>
              <img src={content.heroTertiaryImageUrl || ""} alt="A camera operator creating a visual story" loading="lazy" />
              <span>PHOTO / FILM</span>
            </div>
            <div className={styles.heroIndex}>LC—001<br /><b>IDEA → IMPACT</b></div>
          </div>
        </div>
        <div className={styles.heroBottom}>
          <span>INDEPENDENT CREATIVE PRACTICE</span>
          <a href="#what-we-do">DISCOVER THE STUDIO <b>↓</b></a>
        </div>
      </section>

      <section className={styles.statement} aria-labelledby="statement-title">
        <div className={styles.sectionMeta}>
          <span>01 / THE APPROACH</span>
          <span>THOUGHTFUL BY DESIGN</span>
        </div>
        <div className={styles.statementGrid}>
          <h2 id="statement-title">
            {approachParts[0]}{approachParts.length > 1 ? "." : ""}
            {approachParts.length > 1 && <><br /><em>{approachParts.slice(1).join(". ")}</em></>}
          </h2>
          <div className={styles.statementCopy}>
            <p>{content.approachDescription}</p>
            <a className={styles.inlineLink} href="/about">More about the studio <span>↗</span></a>
          </div>
        </div>
      </section>

      <section className={styles.services} id="what-we-do" aria-labelledby="services-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}><i /> WHAT WE DO</p>
            <h2 id="services-title">Three disciplines.<br /><em>One clear direction.</em></h2>
          </div>
          <p>Choose the support you need today, or bring us a wider brief. We will help connect the right skills to the result you want to achieve.</p>
        </div>
        <div className={styles.serviceGrid}>
          {serviceCards.map((service) => (
            <Reveal key={service.number} className={styles.serviceCard}>
              <a href={service.href} className={styles.serviceImage}>
                <img src={service.image} alt={service.alt} loading="lazy" />
                <span>{service.number} / DISCIPLINE</span>
                <b>↗</b>
              </a>
              <div className={styles.serviceText}>
                <span className={styles.cardKicker}>LIGHT CREATIVE HUB / {service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className={styles.inlineLink} href={service.href}>Explore the service <span>↗</span></a>
              </div>
            </Reveal>
          ))}
        </div>
        <div className={styles.sectionFooter}>
          <span>STRATEGY / DESIGN / PRODUCTION / STORYTELLING</span>
          <a href="/services">VIEW ALL SERVICES <span>↗</span></a>
        </div>
      </section>

      <section className={styles.work} aria-labelledby="work-title">
        <div className={styles.workHeader}>
          <div>
            <p className={styles.eyebrow}><i /> SELECTED WORK</p>
            <h2 id="work-title">Ideas, made<br /><em>visible.</em></h2>
          </div>
          <div className={styles.workIntro}>
            <p>Explore a selection of published projects and visual references across identity, design, print and image-making.</p>
            <a className={styles.buttonLight} href="/portfolio">Explore the portfolio <span>↗</span></a>
          </div>
        </div>
        <div className={styles.projectGrid}>
          {selectedProjects.map((project, index) => {
            const media = project.cover_image_url || (project.media_urls || [])[0] || "";
            return (
              <Reveal key={project.id} className={styles.projectCard}>
                <a href={project.id.startsWith("reference-") ? "/portfolio" : "/portfolio/" + project.slug}>
                  <div className={styles.projectImage}>
                    {media && (isVideo(media)
                      ? <video src={media} muted playsInline preload="metadata" aria-label={project.title} />
                      : <img src={media} alt={project.title} loading="lazy" />)}
                    <span>{String(index + 1).padStart(2, "0")} / {project.category.toUpperCase()}</span>
                    <b>↗</b>
                  </div>
                  <div className={styles.projectCaption}>
                    <div><span>{isReferenceSet ? "VISUAL REFERENCE" : "PUBLISHED PROJECT"}</span><h3>{project.title}</h3></div>
                    <p>{project.summary || "A considered creative response to a clear communication brief."}</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
        {isReferenceSet && <p className={styles.referenceNote}>These are temporary visual references, not commissioned Light Creative Hub projects. Published studio work will replace them as projects are approved in the CMS.</p>}
        <div className={styles.workBottom}><span>FORM / FUNCTION / FEELING</span><a href="/portfolio">OPEN THE PROJECT ARCHIVE ↗</a></div>
      </section>

      <section className={styles.about} aria-labelledby="about-title">
        <div className={styles.aboutImage}>
          <img src={content.founderImageUrl || ""} alt="Founder and creative lead at Light Creative Hub" loading="lazy" />
          <span>THE PEOPLE BEHIND THE WORK</span>
        </div>
        <div className={styles.aboutCopy}>
          <p className={styles.eyebrow}><i /> A CREATIVE PARTNER, NOT JUST A SUPPLIER</p>
          <h2 id="about-title">{content.founderTitle || "Creative thinking. Careful execution."}</h2>
          <blockquote>“{content.founderQuote}”</blockquote>
          <p>We work closely with people building businesses, organisations and ideas — bringing the thinking and making together so every detail supports the bigger picture.</p>
          <a className={styles.inlineLink} href="/about">Meet the studio <span>↗</span></a>
        </div>
      </section>

      <section className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}><i /> {content.contactEyebrow}</p>
          <h2 id="contact-title">{contactParts.slice(0, -2).join(" ")} <em>{contactParts.slice(-2).join(" ")}</em></h2>
          <p>{content.contactDescription}</p>
          <div className={styles.contactActions}>
            <a className={styles.buttonLight} href="/request-a-quote">Tell us about your project <span>↗</span></a>
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
    </div>
  );
}
