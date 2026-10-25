"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  cover_image_url: string | null;
  published: boolean;
  featured: boolean;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Branding & Design");
  const [summary, setSummary] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  async function loadProjects() {
    const supabase = getSupabaseBrowserClient();
    const { data, error: queryError } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,published,featured")
      .order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (queryError) throw queryError;
    setProjects((data ?? []) as Project[]);
  }

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(async ({ data }) => {
        if (data.session) {
          setSignedIn(true);
          try { await loadProjects(); } catch (e) { setError(e instanceof Error ? e.message : "Could not load portfolio."); }
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Supabase is not configured.");
    }
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setSignedIn(true);
      await loadProjects();
      setNotice("Signed in. Your account must be on the admin allowlist to manage projects.");
    } catch (e) { setError(e instanceof Error ? e.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    let uploadedPath: string | null = null;
    try {
      const supabase = getSupabaseBrowserClient();
      let coverUrl: string | null = null;
      if (file) {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) throw new Error("Choose an image or video file.");
        if (file.size > 50 * 1024 * 1024) throw new Error("File must be 50 MB or smaller.");
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
        uploadedPath = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("portfolio-media").upload(uploadedPath, file, { upsert: false, contentType: file.type });
        if (uploadError) throw uploadError;
        coverUrl = supabase.storage.from("portfolio-media").getPublicUrl(uploadedPath).data.publicUrl;
      }
      const { error: insertError } = await supabase.from("portfolio_projects").insert({
        title: title.trim(), slug: slug.trim().toLowerCase(), category, summary: summary.trim(),
        description: summary.trim(), cover_image_url: coverUrl, media_urls: coverUrl ? [coverUrl] : [],
        published, featured, display_order: projects.length
      });
      if (insertError) {
        if (uploadedPath) await supabase.storage.from("portfolio-media").remove([uploadedPath]);
        throw insertError;
      }
      setTitle(""); setSlug(""); setSummary(""); setFile(null); setPublished(false); setFeatured(false);
      const input = document.getElementById("portfolio-media") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadProjects();
      setNotice("Portfolio project saved.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save project."); }
    finally { setBusy(false); }
  }

  async function togglePublished(project: Project) {
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase.from("portfolio_projects").update({ published: !project.published, updated_at: new Date().toISOString() }).eq("id", project.id);
      if (updateError) throw updateError;
      await loadProjects(); setNotice("Portfolio visibility updated.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update project."); }
    finally { setBusy(false); }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
      if (deleteError) throw deleteError;
      await loadProjects(); setNotice("Project deleted. Remove its media from Storage if it is no longer needed.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not delete project."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    try { await getSupabaseBrowserClient().auth.signOut(); setSignedIn(false); setProjects([]); setNotice("Signed out."); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not sign out."); }
  }

  return <section className="section admin-page">
    <p className="eyebrow">LIGHT CREATIVE HUB / ADMIN</p>
    <h1 className="admin-title">Portfolio<br/><em>workspace.</em></h1>
    <p className="admin-lead">Sign in with an approved Supabase Auth account to upload and manage portfolio projects.</p>
    {error && <p role="alert" className="form-error">{error}</p>}
    {notice && <p role="status" className="form-message">{notice}</p>}
    {!signedIn ? <form className="admin-login" onSubmit={signIn}>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
      <button className="button button-blue" disabled={busy}>{busy ? "Please wait…" : "Sign in ↗"}</button>
      <p className="admin-help">Create the admin user in Supabase Authentication, then add that user’s UUID to <code>public.admin_users</code>. Do not expose service-role keys in the browser.</p>
    </form> : <>
      <div className="admin-toolbar"><h2>Manage portfolio</h2><button className="button button-outline-dark" onClick={signOut} disabled={busy}>Sign out</button></div>
      <form className="admin-project-form" onSubmit={addProject}>
        <h3>Add a project</h3>
        <div className="form-grid">
          <label>Project title *<input value={title} onChange={e=>{setTitle(e.target.value);setSlug(e.target.value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));}} required minLength={2} maxLength={180}/></label>
          <label>URL slug *<input value={slug} onChange={e=>setSlug(e.target.value.toLowerCase())} required pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label>
          <label>Category *<select value={category} onChange={e=>setCategory(e.target.value)}><option>Branding & Design</option><option>Print</option><option>Photography</option><option>Videography</option><option>Content Production</option><option>Other</option></select></label>
          <label>Cover image or video<input id="portfolio-media" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" onChange={handleFile}/><small>Optional · max 50 MB</small></label>
          <label className="field-full">Project summary *<textarea value={summary} onChange={e=>setSummary(e.target.value)} required minLength={2} maxLength={1000} rows={3}/></label>
        </div>
        <div className="admin-checks"><label><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish immediately</label><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)}/> Feature on homepage</label></div>
        <button className="button button-blue" disabled={busy}>{busy ? "Saving…" : "Save project ↗"}</button>
      </form>
      <div className="admin-project-list"><h3>Existing projects ({projects.length})</h3>{projects.length===0?<p>No projects have been added yet.</p>:projects.map(project=><article className="admin-project-row" key={project.id}><div><strong>{project.title}</strong><p>{project.category} · /{project.slug}</p><span className={project.published?"status-live":"status-draft"}>{project.published?"Published":"Draft"}</span></div><div className="admin-row-actions"><button className="button button-outline-dark" onClick={()=>togglePublished(project)} disabled={busy}>{project.published?"Unpublish":"Publish"}</button><button className="button button-danger" onClick={()=>deleteProject(project)} disabled={busy}>Delete</button></div></article>)}</div>
    </>}
  </section>;
}
