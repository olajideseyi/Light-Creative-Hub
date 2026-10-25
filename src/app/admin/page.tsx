"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Project = {
  id: string; title: string; slug: string; category: string; summary: string | null;
  description?: string | null; cover_image_url: string | null; media_urls: string[] | null;
  published: boolean; featured: boolean; display_order?: number;
};
const BUCKET = "portfolio-media";
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED = ["image/jpeg","image/png","image/webp","image/avif","video/mp4","video/webm","video/quicktime"];
const CATEGORIES = ["Branding & Design","Re-branding","Graphic Design","Print","Photography","Videography","Data Analysis","PR & Communications","Content Production","Other"];
const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const isVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
const isVideoFile = (file: File) => file.type.startsWith("video/");

function MediaPreview({ url, title, compact = false }: {url: string; title: string; compact?: boolean}) {
  return <div className={compact ? "cms-media-thumb cms-media-thumb-compact" : "cms-media-preview"}>
    {isVideo(url) ? <video src={url} controls playsInline preload="metadata" aria-label={title}/> : <img src={url} alt={title} loading="lazy"/>}
    <span>{isVideo(url) ? "VIDEO" : "IMAGE"}</span>
  </div>;
}

export default function AdminPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [signedIn,setSignedIn]=useState(false); const [projects,setProjects]=useState<Project[]>([]);
  const [busy,setBusy]=useState(false); const [notice,setNotice]=useState(""); const [error,setError]=useState("");
  const [coverFile,setCoverFile]=useState<File|null>(null); const [galleryFiles,setGalleryFiles]=useState<File[]>([]);
  const [title,setTitle]=useState(""); const [slug,setSlug]=useState(""); const [category,setCategory]=useState(CATEGORIES[0]);
  const [summary,setSummary]=useState(""); const [description,setDescription]=useState("");
  const [published,setPublished]=useState(false); const [featured,setFeatured]=useState(false);
  const [editingId,setEditingId]=useState<string|null>(null); const [existingMedia,setExistingMedia]=useState<string[]>([]);
  const [activeTab,setActiveTab]=useState<"all"|"published"|"drafts">("all");
  const [previewProject,setPreviewProject]=useState<Project|null>(null);
  type SiteDoc = Record<string,string|boolean>;
  const [siteDocs,setSiteDocs]=useState<Record<string,SiteDoc>>({});
  const [cmsSection,setCmsSection]=useState<"homepage"|"about"|"services"|"contact"|"effects">("homepage");
  const [cmsLoading,setCmsLoading]=useState(false);

  async function verifyAdminAccess() {
    const supabase=getSupabaseBrowserClient();
    const {data:userResult,error:userError}=await supabase.auth.getUser();
    if(userError||!userResult.user) throw new Error("Your session has expired. Please sign in again.");
    const {data,error:accessError}=await supabase.from("admin_users").select("user_id,role").eq("user_id",userResult.user.id).maybeSingle();
    if(accessError||!data) throw new Error("This account is not approved for the admin workspace. Ask the site owner to approve your Supabase user ID.");
    return userResult.user;
  }
  async function loadSiteContent() {
    const {data,error:queryError}=await getSupabaseBrowserClient().from("site_content").select("content_key,content_value");
    if(queryError) throw queryError;
    const next:Record<string,SiteDoc>={};
    for(const row of data??[]) next[row.content_key]=row.content_value as SiteDoc;
    next.homepage = {heroEyebrow:"INDEPENDENT CREATIVE STUDIO",heroTitle:"A sharper look. A stronger brand.",heroDescription:"Light Creative Hub helps businesses and individuals turn ideas into clear identities, compelling design, quality print and visual stories people remember.",primaryCta:"Tell us about your project",secondaryCta:"Explore selected work",approachTitle:"Good design looks good. Great design does a job.",approachDescription:"Every colour, frame, word and printed detail should have a reason to be there. We bring creative thinking and practical execution together so the result is not only beautiful — it works for the people you need to reach.",heroPrimaryImageUrl:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=85",heroSecondaryImageUrl:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",heroTertiaryImageUrl:"https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85",founderImageUrl:"https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg",founderTitle:"Give good ideas room to become.",founderQuote:"Remember that creativity requires time and space. Allow yourself to recharge, seek inspiration from diverse sources, and let ideas marinate.",contactEyebrow:"HAVE SOMETHING IN MIND?",contactTitle:"Let’s make it memorable.",contactDescription:"Tell us what you want to build, launch, print or communicate. We’ll take it from there — one thoughtful step at a time.",service1Title:"Brand identity & rebranding",service1Description:"Logos, colour systems, typography and brand guidelines that make a business recognisable.",service2Title:"Graphic design & campaigns",service2Description:"Flyers, posters, social content, event graphics and marketing materials made to communicate clearly.",service3Title:"Printing & finishing",service3Description:"Business cards, brochures, banners and print-ready materials, considered from artwork to final finish.",service4Title:"Photography & videography",service4Description:"People, products, events and brand stories captured with a clear point of view.",service5Title:"Content & communications",service5Description:"Visual content, public relations and messaging that help your brand show up consistently.",service6Title:"Data analysis & presentation",service6Description:"Information organised into clear reports and visual presentations that are easier to understand.",...(next.homepage??{})};
    next.services = {title:"Good ideas. Made visible.",description:"From a distinctive brand identity to the final printed piece or moving image, we bring thoughtful creative work and practical production together.",introTitle:"One creative partner. Connected capabilities.",introDescription:"Choose the service you need, or bring us a bigger brief. We’ll help you work out the right combination, without making the process more complicated than it needs to be.",...(next.services??{})};
    next.about = {eyebrow:"THE STUDIO / WHO WE ARE",title:"A studio with a point of view.",description:"We build distinctive brand identities and visual communication for businesses ready to present themselves with clarity, confidence and consistency. From the first strategic conversation to the finished design or printed piece, our focus is work that looks considered and serves a clear purpose.",founderQuote:"The best creative work gives an idea room to breathe—and gives the audience a clear reason to care.",founderName:"Adeniyi Boluwatife",founderRole:"Founder · Light Creative Hub",founderImageUrl:"https://kjgqztbxlbqpwzbbgkib.supabase.co/storage/v1/object/public/portfolio-media/1792947221622-whatsapp-image-2026-10-25-at-4.41.49-pm.jpeg",principleOneTitle:"Clarity before decoration",principleOneDescription:"Every project begins with the audience, the message and the outcome — not just a trend.",principleTwoTitle:"Craft at every touchpoint",principleTwoDescription:"Typography, composition, materials, lighting, pacing and finishing all shape the experience.",principleThreeTitle:"A connected creative process",principleThreeDescription:"One studio partner helps keep the idea consistent from the first conversation to final delivery.",...(next.about??{})};
    setSiteDocs(next);
  }
  async function saveSiteContent(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setCmsLoading(true);setError("");setNotice("");
    try {
      const {data:userResult,error:userError}=await getSupabaseBrowserClient().auth.getUser();
      if(userError||!userResult.user) throw new Error("Please sign in again to save site content.");
      const value=siteDocs[cmsSection]??{};
      const {error:saveError}=await getSupabaseBrowserClient().from("site_content").upsert({content_key:cmsSection,content_value:value,updated_at:new Date().toISOString(),updated_by:userResult.user.id},{onConflict:"content_key"});
      if(saveError) throw saveError;
      setNotice("Saved "+cmsSection+" settings. Public pages will read these settings.");
    } catch(e) {setError(e instanceof Error?e.message:"Could not save site content.");}
    finally {setCmsLoading(false);}
  }
  function changeDoc(key:string,value:string|boolean) {
    setSiteDocs(old=>({...old,[cmsSection]:{...(old[cmsSection]??{}),[key]:value}}));
  }
  async function loadProjects() {
    const {data,error:queryError}=await getSupabaseBrowserClient().from("portfolio_projects")
      .select("id,title,slug,category,summary,description,cover_image_url,media_urls,published,featured,display_order")
      .order("display_order",{ascending:true}).order("created_at",{ascending:false});
    if(queryError) throw queryError;
    setProjects((data??[]) as Project[]);
  }
  useEffect(()=>{
    let active=true;
    try {
      const supabase=getSupabaseBrowserClient();
      supabase.auth.getSession().then(async ({data,error:sessionError})=>{
        if(!active)return;
        if(sessionError){setError(sessionError.message);return;}
        if(data.session)try{await verifyAdminAccess();await loadProjects();await loadSiteContent();if(active)setSignedIn(true);}
        catch(e){if(active){setSignedIn(false);setError(e instanceof Error?e.message:"This account cannot access the admin workspace.");}}
      }).catch((e:unknown)=>{if(active)setError(e instanceof Error?e.message:"Could not check your session.");});
    } catch(e){setError(e instanceof Error?e.message:"Supabase is not configured.");}
    return()=>{active=false;};
  },[]);

  function resetForm() {
    setEditingId(null);setTitle("");setSlug("");setCategory(CATEGORIES[0]);setSummary("");setDescription("");
    setPublished(false);setFeatured(false);setCoverFile(null);setGalleryFiles([]);setExistingMedia([]);
    const cover=document.getElementById("cms-cover") as HTMLInputElement|null; if(cover)cover.value="";
    const gallery=document.getElementById("cms-gallery") as HTMLInputElement|null; if(gallery)gallery.value="";
  }
  function startEdit(project:Project) {
    setEditingId(project.id);setTitle(project.title);setSlug(project.slug);setCategory(project.category||CATEGORIES[0]);
    setSummary(project.summary||"");setDescription(project.description||project.summary||"");
    setPublished(project.published);setFeatured(project.featured);
    setExistingMedia(Array.from(new Set([...(project.cover_image_url?[project.cover_image_url]:[]),...(project.media_urls||[])])));
    setCoverFile(null);setGalleryFiles([]);setPreviewProject(null);
    const form=document.getElementById("cms-editor");form?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  async function signIn(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError("");setNotice("");
    try{
      const supabase=getSupabaseBrowserClient();const {error:authError}=await supabase.auth.signInWithPassword({email:email.trim(),password});
      if(authError)throw authError;
      try{await verifyAdminAccess();await loadProjects();await loadSiteContent();}catch(e){await supabase.auth.signOut();throw e;}
      setSignedIn(true);setPassword("");setNotice("Signed in. Your approved projects are ready to manage.");
    }catch(e){setError(e instanceof Error?e.message:"Sign-in failed. Check your details and try again.");}finally{setBusy(false);}
  }
  function validateFiles(files:File[]) {
    for(const file of files){if(!ACCEPTED.includes(file.type))throw new Error("Use JPG, PNG, WebP, AVIF, MP4, WebM or MOV files.");if(file.size>MAX_FILE_SIZE)throw new Error("Each media file must be 50 MB or smaller.");}
  }
  async function uploadMedia(file:File) {
    const supabase=getSupabaseBrowserClient();
    const safeName=file.name.toLowerCase().replace(/[^a-z0-9.-]+/g,"-").slice(-100);
    const objectPath=`${Date.now()}-${Math.random().toString(36).slice(2,8)}-${safeName}`;
    const {error:uploadError}=await supabase.storage.from(BUCKET).upload(objectPath,file,{upsert:false,contentType:file.type});
    if(uploadError)throw uploadError;
    return supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
  }
  async function saveProject(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError("");setNotice("");
    const uploadedUrls:string[]=[];
    try{
      validateFiles([...(coverFile?[coverFile]:[]),...galleryFiles]);
      const supabase=getSupabaseBrowserClient();
      let coverUrl=existingMedia[0]||null;
      if(coverFile){coverUrl=await uploadMedia(coverFile);uploadedUrls.push(coverUrl);}
      const galleryUrls:string[]=[];
      for(const file of galleryFiles){const url=await uploadMedia(file);galleryUrls.push(url);uploadedUrls.push(url);}
      const mediaUrls=Array.from(new Set([...existingMedia.filter(url=>url!==coverUrl),...galleryUrls]));
      const payload={title:title.trim(),slug:slugify(slug),category,summary:summary.trim(),description:(description.trim()||summary.trim()),cover_image_url:coverUrl,media_urls:mediaUrls,published,featured,updated_at:new Date().toISOString(),display_order:editingId?(projects.find(p=>p.id===editingId)?.display_order??projects.length):projects.length};
      const result=editingId
        ? await supabase.from("portfolio_projects").update(payload).eq("id",editingId)
        : await supabase.from("portfolio_projects").insert(payload);
      if(result.error)throw result.error;
      await loadProjects();resetForm();setNotice(editingId?"Project changes saved.":"Project created successfully.");
    }catch(e){
      if(uploadedUrls.length){const paths=uploadedUrls.map(url=>{try{return new URL(url).pathname.split(`/storage/v1/object/public/${BUCKET}/`)[1];}catch{return null;}}).filter((v):v is string=>Boolean(v));if(paths.length)await getSupabaseBrowserClient().storage.from(BUCKET).remove(paths).catch(()=>undefined);}
      setError(e instanceof Error?e.message:"Could not save the project. Check your Storage and database policies.");
    }finally{setBusy(false);}
  }
  async function togglePublished(project:Project) {
    setBusy(true);setError("");setNotice("");
    try{const {error:e}=await getSupabaseBrowserClient().from("portfolio_projects").update({published:!project.published,updated_at:new Date().toISOString()}).eq("id",project.id);if(e)throw e;await loadProjects();setNotice(`“${project.title}” is now ${project.published?"a draft":"published"}.`);}
    catch(e){setError(e instanceof Error?e.message:"Could not update project visibility.");}finally{setBusy(false);}
  }
  async function deleteProject(project:Project) {
    if(!window.confirm(`Permanently delete “${project.title}”? This cannot be undone.`))return;
    setBusy(true);setError("");setNotice("");
    try{const {error:e}=await getSupabaseBrowserClient().from("portfolio_projects").delete().eq("id",project.id);if(e)throw e;await loadProjects();setPreviewProject(null);if(editingId===project.id)resetForm();setNotice("Project deleted from the portfolio.");}
    catch(e){setError(e instanceof Error?e.message:"Could not delete project.");}finally{setBusy(false);}
  }
  async function signOut(){try{await getSupabaseBrowserClient().auth.signOut();setSignedIn(false);setProjects([]);resetForm();setNotice("You have signed out.");setError("");}catch(e){setError(e instanceof Error?e.message:"Could not sign out.");}}
  const publishedCount=projects.filter(p=>p.published).length;
  const filteredProjects=useMemo(()=>projects.filter(p=>activeTab==="all"||(activeTab==="published"?p.published:!p.published)),[projects,activeTab]);

  return <section className="admin-page cms-admin-page"><div className="admin-shell">
    <header className="admin-masthead"><div className="admin-brand"><span className="admin-brand-mark">L</span><div><strong>Light Creative Hub</strong><small>STUDIO CONTROL ROOM / CMS</small></div></div><div className="admin-masthead-right"><span>CONTENT MANAGEMENT</span>{signedIn&&<><span className="admin-status-pill">Secure session</span><button className="button button-outline-dark" onClick={signOut} disabled={busy}>Sign out</button></>}</div></header>
    {!signedIn?<div className="admin-login-layout"><div className="admin-welcome"><div><p className="eyebrow">STUDIO ACCESS / 01</p><h1>Make the work<br/><em>visible.</em></h1><p>Manage portfolio projects, media, descriptions and what appears on the public website.</p></div></div><form className="admin-login" onSubmit={signIn}><div className="admin-panel-head"><div><h2>Administrator sign in</h2><p>Use the Supabase Auth account approved for this studio.</p></div></div>{error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status" className="form-message">{notice}</p>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="button button-blue" disabled={busy}>{busy?"Checking access…":"Enter the studio CMS ↗"}</button><p className="admin-help">Only accounts listed in the Supabase admin allowlist can edit or publish content.</p></form></div>:<>
      <div className="cms-welcome-row"><div className="admin-welcome"><div><p className="eyebrow">STUDIO CONTROL ROOM / OVERVIEW</p><h1>Content that tells<br/><em>your story.</em></h1><p>Upload real work, preview it before publishing and keep your public portfolio current.</p></div></div><a className="button button-outline-dark cms-view-site" href="/portfolio" target="_blank" rel="noreferrer">View public portfolio ↗</a></div>
      {error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status" className="form-message">{notice}</p>}
      <section className="admin-panel site-content-cms" id="site-content-editor">
        <div className="admin-panel-head"><div><span className="cms-eyebrow">SITE-WIDE CONTENT</span><h2>Edit the website, not just the projects.</h2><p>Update copy and creative behaviour settings in Supabase. Fields save as structured content for the public pages to consume.</p></div></div>
        <div className="cms-library-tabs site-content-tabs">
          {(["homepage","about","services","contact","effects"] as const).map(key=><button type="button" key={key} className={cmsSection===key?"active":""} onClick={()=>setCmsSection(key)}>{({homepage:"Homepage",about:"About",services:"Services",contact:"Contact",effects:"Motion & effects"} as const)[key]}</button>)}
        </div>
        <form className="admin-project-form" onSubmit={saveSiteContent}>
          {cmsSection==="services" ? <div className="form-grid">
            <label className="field-full">Services page headline<textarea rows={2} value={String(siteDocs.services?.title??"Good ideas. Made visible.")} onChange={e=>changeDoc("title",e.target.value)} maxLength={180} required/></label>
            <label className="field-full">Services page introduction<textarea rows={4} value={String(siteDocs.services?.description??"")} onChange={e=>changeDoc("description",e.target.value)} maxLength={1500} required/></label>
            <label className="field-full">Capabilities section heading<textarea rows={2} value={String(siteDocs.services?.introTitle??"One creative partner. Connected capabilities.")} onChange={e=>changeDoc("introTitle",e.target.value)} maxLength={180} required/></label>
            <label className="field-full">Capabilities section description<textarea rows={3} value={String(siteDocs.services?.introDescription??"")} onChange={e=>changeDoc("introDescription",e.target.value)} maxLength={1500} required/></label>
          </div> : cmsSection==="contact" ? <div className="form-grid">
            <label className="field-full">Contact page headline<textarea rows={2} value={String(siteDocs.contact?.title??"Have a good idea? Let’s give it a strong visual voice.")} onChange={e=>changeDoc("title",e.target.value)} maxLength={180} required/></label>
            <label className="field-full">Contact page introduction<textarea rows={3} value={String(siteDocs.contact?.description??"Tell us what you are building, who you need to reach and what success should look like. We will help shape the next step.")} onChange={e=>changeDoc("description",e.target.value)} maxLength={1500} required/></label>
            <label>WhatsApp number (international format, digits only)<input value={String(siteDocs.contact?.whatsappPhone??"2347067376478")} onChange={e=>changeDoc("whatsappPhone",e.target.value.replace(/\D/g,""))} placeholder="2347067376478" required/></label>
            <label>Primary phone number<input value={String(siteDocs.contact?.primaryPhone??"0706 737 6478")} onChange={e=>changeDoc("primaryPhone",e.target.value)} required/></label>
            <label>Secondary phone number<input value={String(siteDocs.contact?.secondaryPhone??"0904 521 8491")} onChange={e=>changeDoc("secondaryPhone",e.target.value)}/></label>
            <label>Contact email<input type="email" value={String(siteDocs.contact?.email??"lightcreativehub0@gmail.com")} onChange={e=>changeDoc("email",e.target.value)} required/></label>
            <label className="field-full">WhatsApp opening message<textarea rows={3} value={String(siteDocs.contact?.whatsappMessage??"Hello Light Creative Hub, I’d like to discuss a project.")} onChange={e=>changeDoc("whatsappMessage",e.target.value)} maxLength={500}/></label>
          </div> : cmsSection==="effects" ? <div className="form-grid">
            <label>Image motion<select value={String(siteDocs.effects?.imageEffect??"float")} onChange={e=>changeDoc("imageEffect",e.target.value)}><option value="float">Floating / gentle drift</option><option value="parallax">Parallax depth</option><option value="zoom">Slow cinematic zoom</option><option value="static">No image motion</option></select></label>
            <label>Gallery transition<select value={String(siteDocs.effects?.transition??"crossfade")} onChange={e=>changeDoc("transition",e.target.value)}><option value="crossfade">Soft crossfade</option><option value="slide">Slide between images</option><option value="wipe">Editorial wipe</option><option value="none">No transition</option></select></label>
            <label>Scroll reveal<select value={String(siteDocs.effects?.reveal??"fade-up")} onChange={e=>changeDoc("reveal",e.target.value)}><option value="fade-up">Fade and lift</option><option value="fade">Fade only</option><option value="blur">Soft-focus reveal</option><option value="none">No reveal</option></select></label>
            <label>Gallery layout<select value={String(siteDocs.effects?.galleryLayout??"editorial")} onChange={e=>changeDoc("galleryLayout",e.target.value)}><option value="editorial">Editorial masonry</option><option value="grid">Clean image grid</option><option value="carousel">Horizontal carousel</option></select></label>
            <label>WhatsApp contact style<select value={String(siteDocs.effects?.whatsappStyle??"expandable")} onChange={e=>changeDoc("whatsappStyle",e.target.value)}><option value="expandable">Expandable contact panel</option><option value="standard">Standard WhatsApp button</option><option value="minimal">Minimal floating icon</option></select></label>
            <label className="field-full cms-toggle-row"><input type="checkbox" checked={siteDocs.effects?.motionEnabled!==false} onChange={e=>changeDoc("motionEnabled",e.target.checked)}/> Enable decorative motion (respects reduced-motion preferences)</label>
          </div> : <div className="form-grid">
            {Object.entries(siteDocs[cmsSection]??{}).filter(([,v])=>typeof v==="string").map(([key,value])=><label key={key} className="field-full">{key.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())}<textarea rows={key.toLowerCase().includes("description")?4:2} value={String(value)} onChange={e=>changeDoc(key,e.target.value)} maxLength={5000}/></label>)}
            {Object.keys(siteDocs[cmsSection]??{}).length===0&&<p>Content fields are being initialized. Refresh this page after the CMS migration is available.</p>}
          </div>}
          <div className="cms-form-actions"><button className="button button-blue" disabled={cmsLoading}>{cmsLoading?"Saving…":"Save "+({homepage:"homepage content",about:"About content",services:"services content",contact:"contact content",effects:"creative settings"} as const)[cmsSection]+" ↗"}</button><span className="admin-help">Saved settings are used by the public contact controls and site pages.</span></div>
        </form>
      </section>
      <div className="admin-dashboard-stats"><div className="admin-stat"><span>Total projects</span><strong>{projects.length}</strong><small>All portfolio entries</small></div><div className="admin-stat"><span>Published</span><strong>{publishedCount}</strong><small>Visible on the public site</small></div><div className="admin-stat"><span>Drafts</span><strong>{projects.length-publishedCount}</strong><small>Only visible in this CMS</small></div></div>
      <div className="cms-layout">
        <section className="admin-panel cms-editor-panel" id="cms-editor"><div className="admin-panel-head"><div><span className="cms-eyebrow">{editingId?"EDIT EXISTING PROJECT":"CREATE NEW PROJECT"}</span><h2>{editingId?"Refine the details.":"Add to the archive."}</h2><p>Media uploads are stored in your Supabase Storage bucket.</p></div>{editingId&&<button type="button" className="button button-outline-dark" onClick={resetForm}>Cancel edit</button>}</div>
          <form className="admin-project-form" onSubmit={saveProject}><div className="form-grid">
            <label>Project title *<input value={title} onChange={e=>{setTitle(e.target.value);if(!editingId||!slug)setSlug(slugify(e.target.value));}} required minLength={2} maxLength={180} placeholder="e.g. Identity for a new brand"/></label>
            <label>URL slug *<input value={slug} onChange={e=>setSlug(slugify(e.target.value))} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="identity-for-a-new-brand"/></label>
            <label>Service category *<select value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
            <label>Cover image or video<input id="cms-cover" type="file" accept={ACCEPTED.join(",")} onChange={(e:ChangeEvent<HTMLInputElement>)=>setCoverFile(e.target.files?.[0]??null)}/><small>Choose a new cover to replace the current one. Maximum 50 MB.</small></label>
            <label className="field-full">Short project summary *<textarea value={summary} onChange={e=>setSummary(e.target.value)} required minLength={10} maxLength={1000} rows={3} placeholder="A concise description shown in portfolio cards."/></label>
            <label className="field-full">Full project description<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={5000} rows={4} placeholder="Add the brief, creative approach, deliverables and story behind the work."/></label>
            <label className="field-full">Add gallery images or videos<input id="cms-gallery" type="file" multiple accept={ACCEPTED.join(",")} onChange={e=>setGalleryFiles(Array.from(e.target.files??[]))}/><small>Select multiple files at once. Supported: JPG, PNG, WebP, AVIF, MP4, WebM and MOV.</small></label>
          </div>
          {(existingMedia.length>0||coverFile||galleryFiles.length>0)&&<div className="cms-preview-block"><div className="cms-preview-heading"><div><h3>Media preview</h3><p>Check the images and videos before you save.</p></div><span>{(existingMedia.length+(coverFile?1:0)+galleryFiles.length)} MEDIA ITEMS</span></div><div className="cms-media-grid">
            {coverFile&&<div className="cms-media-item"><div className="cms-media-thumb">{isVideoFile(coverFile)?<video src={URL.createObjectURL(coverFile)} controls playsInline/>:<img src={URL.createObjectURL(coverFile)} alt="New cover preview"/>}<span>NEW COVER</span></div><small>{coverFile.name}</small></div>}
            {!coverFile&&existingMedia.map((url,i)=><div className="cms-media-item" key={url}><MediaPreview url={url} title={title||"Current project media"} compact/><small>{i===0?"Current cover / media":`Gallery item ${i+1}`}</small><button type="button" className="cms-remove-media" onClick={()=>setExistingMedia(old=>old.filter(item=>item!==url))}>Remove from project</button></div>)}
            {galleryFiles.map((file,i)=><div className="cms-media-item" key={`${file.name}-${i}`}><div className="cms-media-thumb">{isVideoFile(file)?<video src={URL.createObjectURL(file)} controls playsInline/>:<img src={URL.createObjectURL(file)} alt={file.name}/>}<span>NEW GALLERY</span></div><small>{file.name}</small></div>)}
          </div></div>}
          <div className="admin-checks"><label><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish on public portfolio</label><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)}/> Feature this project</label></div>
          <div className="cms-form-actions"><button className="button button-blue" disabled={busy}>{busy?(editingId?"Saving changes…":"Creating project…"):(editingId?"Save project changes ↗":"Create portfolio project ↗")}</button><button type="button" className="button button-outline-dark" onClick={resetForm} disabled={busy}>Clear form</button></div>
        </form>
      </section>
      <section className="admin-panel cms-library-panel"><div className="admin-panel-head"><div><span className="cms-eyebrow">YOUR CONTENT</span><h2>Portfolio library</h2><p>Open any project to preview, edit or manage its publication.</p></div><span className="cms-count-pill">{projects.length} ITEMS</span></div>
        <div className="cms-library-tabs"><button className={activeTab==="all"?"active":""} onClick={()=>setActiveTab("all")}>All <b>{projects.length}</b></button><button className={activeTab==="published"?"active":""} onClick={()=>setActiveTab("published")}>Published <b>{publishedCount}</b></button><button className={activeTab==="drafts"?"active":""} onClick={()=>setActiveTab("drafts")}>Drafts <b>{projects.length-publishedCount}</b></button></div>
        {filteredProjects.length===0?<div className="admin-empty"><strong>{projects.length?"Nothing in this filter yet.":"Your portfolio library is ready."}</strong><br/>{projects.length?"Choose another tab to see your projects.":"Create your first entry using the editor. You can keep it as a draft until it is ready."}</div>:<div className="cms-project-grid">{filteredProjects.map(project=>{const cover=project.cover_image_url||(project.media_urls||[])[0];return <article className="cms-project-card" key={project.id}>
          <button type="button" className="cms-card-preview" onClick={()=>setPreviewProject(project)} aria-label={`Preview ${project.title}`}>{cover?<MediaPreview url={cover} title={project.title} compact/>:<div className="cms-no-media"><span>LCH / PROJECT</span><strong>{project.category}</strong></div>}<span className="cms-open-overlay">Open preview ↗</span></button>
          <div className="cms-card-copy"><div className="cms-card-badges"><span className={project.published?"status-live":"status-draft"}>{project.published?"Published":"Draft"}</span>{project.featured&&<span className="cms-featured-badge">Featured</span>}</div><h3>{project.title}</h3><p>{project.category}</p><div className="cms-card-actions"><button type="button" className="button button-outline-dark" onClick={()=>startEdit(project)}>Edit details</button><button type="button" className="button button-outline-dark" onClick={()=>togglePublished(project)} disabled={busy}>{project.published?"Unpublish":"Publish"}</button><button type="button" className="cms-delete-button" onClick={()=>deleteProject(project)} disabled={busy}>Delete</button></div></div>
        </article>;})}</div>}
      </section></div>
    </>}
  </div>
  {previewProject&&<div className="cms-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setPreviewProject(null);}}><section className="cms-preview-modal" role="dialog" aria-modal="true" aria-label={`Preview ${previewProject.title}`}><header><div><span className="cms-eyebrow">PROJECT PREVIEW / {previewProject.published?"PUBLISHED":"DRAFT"}</span><h2>{previewProject.title}</h2></div><button type="button" className="cms-modal-close" onClick={()=>setPreviewProject(null)} aria-label="Close preview">×</button></header><p className="cms-modal-category">{previewProject.category} · /{previewProject.slug}</p><p>{previewProject.summary}</p><div className="cms-modal-media-grid">{Array.from(new Set([...(previewProject.cover_image_url?[previewProject.cover_image_url]:[]),...(previewProject.media_urls||[])])).map((url,i)=><MediaPreview key={url} url={url} title={`${previewProject.title} media ${i+1}`}/>)}</div>{previewProject.description&&previewProject.description!==previewProject.summary&&<div className="cms-modal-description"><h3>Full description</h3><p>{previewProject.description}</p></div>}<footer><button type="button" className="button button-blue" onClick={()=>startEdit(previewProject)}>Edit project ↗</button><button type="button" className="button button-outline-dark" onClick={()=>togglePublished(previewProject)} disabled={busy}>{previewProject.published?"Unpublish project":"Publish project"}</button><button type="button" className="button button-outline-dark" onClick={()=>setPreviewProject(null)}>Close preview</button></footer></section></div>}
  </section>;
}
