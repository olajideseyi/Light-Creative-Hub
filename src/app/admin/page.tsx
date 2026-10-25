"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Project = {
  id: string; title: string; slug: string; category: string; summary: string;
  cover_image_url: string | null; published: boolean; featured: boolean;
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

  async function verifyAdminAccess() {
    const supabase = getSupabaseBrowserClient();
    const { data: userResult, error: userError } = await supabase.auth.getUser();
    if (userError || !userResult.user) throw new Error("Your session has expired. Please sign in again.");
    const { data, error: accessError } = await supabase.from("admin_users")
      .select("user_id,role").eq("user_id", userResult.user.id).maybeSingle();
    if (accessError || !data) throw new Error("This account is not approved for the Light Creative Hub admin workspace. Ask the site owner to approve your user ID.");
    return userResult.user;
  }

  async function loadProjects() {
    const supabase = getSupabaseBrowserClient();
    const { data, error: queryError } = await supabase.from("portfolio_projects")
      .select("id,title,slug,category,summary,cover_image_url,published,featured")
      .order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (queryError) throw queryError;
    setProjects((data ?? []) as Project[]);
  }

  useEffect(() => {
    let active = true;
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) { setError(sessionError.message); return; }
        if (data.session) {
          try {
            await verifyAdminAccess();
            await loadProjects();
            if (active) setSignedIn(true);
          } catch (e) {
            if (active) { setSignedIn(false); setError(e instanceof Error ? e.message : "This account cannot access the admin workspace."); }
          }
        }
      }).catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : "Could not check your session."); });
    } catch (e) { setError(e instanceof Error ? e.message : "Supabase is not configured."); }
    return () => { active = false; };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      try {
        await verifyAdminAccess();
        await loadProjects();
      } catch (accessError) {
        await supabase.auth.signOut();
        throw accessError;
      }
      setSignedIn(true);
      setPassword("");
      setNotice("You're signed in. Portfolio changes are available to approved administrators.");
    } catch (e) { setError(e instanceof Error ? e.message : "Sign-in failed. Check your details and try again."); }
    finally { setBusy(false); }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) { setFile(event.target.files?.[0] ?? null); }

  async function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    let uploadedPath: string | null = null;
    try {
      const supabase = getSupabaseBrowserClient();
      let coverUrl: string | null = null;
      if (file) {
        const allowed = ["image/jpeg","image/png","image/webp","image/avif","video/mp4","video/webm","video/quicktime"];
        if (!allowed.includes(file.type)) throw new Error("Choose a JPG, PNG, WebP, AVIF, MP4, WebM or MOV file.");
        if (file.size > 50 * 1024 * 1024) throw new Error("The file must be 50 MB or smaller.");
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(-100);
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
      await loadProjects(); setNotice("Project saved successfully.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save the project."); }
    finally { setBusy(false); }
  }

  async function togglePublished(project: Project) {
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: updateError } = await getSupabaseBrowserClient().from("portfolio_projects")
        .update({ published: !project.published, updated_at: new Date().toISOString() }).eq("id", project.id);
      if (updateError) throw updateError;
      await loadProjects(); setNotice(`“${project.title}” is now ${project.published ? "a draft" : "published"}.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update project visibility."); }
    finally { setBusy(false); }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Permanently delete “${project.title}”? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
      if (deleteError) throw deleteError;
      await loadProjects(); setNotice("Project deleted. If its media is no longer needed, remove it from Storage too.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not delete project."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    try { await getSupabaseBrowserClient().auth.signOut(); setSignedIn(false); setProjects([]); setNotice("You have signed out."); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not sign out."); }
  }

  const publishedCount = projects.filter(project => project.published).length;
  const draftCount = projects.length - publishedCount;

  return <section className="admin-page">
    <div className="admin-shell">
      <header className="admin-masthead">
        <div className="admin-brand"><span className="admin-brand-mark">L</span><div><strong>Light Creative Hub</strong><small>STUDIO CONTROL ROOM / ADMIN</small></div></div>
        <div className="admin-masthead-right"><span>PORTFOLIO MANAGEMENT</span>{signedIn && <><span className="admin-status-pill">Secure session</span><button className="button button-outline-dark" onClick={signOut} disabled={busy}>Sign out</button></>}</div>
      </header>

      {!signedIn ? <div className="admin-login-layout">
        <div className="admin-welcome"><div><p className="eyebrow">STUDIO ACCESS / 01</p><h1>Welcome<br/><em>back.</em></h1><p>Sign in to curate the studio portfolio, publish new work and keep the gallery current.</p></div></div>
        <form className="admin-login" onSubmit={signIn}>
          <div className="admin-panel-head"><div><h2>Administrator sign in</h2><p>Use the Supabase Auth account approved for portfolio management.</p></div></div>
          {error && <p role="alert" className="form-error">{error}</p>}
          {notice && <p role="status" className="form-message">{notice}</p>}
          <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>
          <button className="button button-blue" disabled={busy}>{busy ? "Checking access…" : "Sign in to workspace ↗"}</button>
          <p className="admin-help">Access is controlled by Supabase authentication and the studio admin allowlist. A successful login alone does not grant permission to publish.</p>
        </form>
      </div> : <>
        <div className="admin-welcome"><div><p className="eyebrow">STUDIO CONTROL ROOM / OVERVIEW</p><h1>Your portfolio,<br/><em>your point of view.</em></h1><p>Upload approved work, keep drafts organised and decide what visitors can see.</p></div><span className="admin-status-pill">Admin workspace</span></div>
        {error && <p role="alert" className="form-error">{error}</p>}
        {notice && <p role="status" className="form-message">{notice}</p>}
        <div className="admin-dashboard-stats">
          <div className="admin-stat"><span>Total projects</span><strong>{projects.length}</strong><small>All portfolio entries</small></div>
          <div className="admin-stat"><span>Published</span><strong>{publishedCount}</strong><small>Visible in the public gallery</small></div>
          <div className="admin-stat"><span>Drafts</span><strong>{draftCount}</strong><small>Work in progress</small></div>
        </div>
        <div className="admin-workspace-grid">
          <section className="admin-panel">
            <div className="admin-panel-head"><div><h2>Add portfolio project</h2><p>Use approved artwork and clear project descriptions.</p></div><span className="admin-status-pill">New entry</span></div>
            <form className="admin-project-form" onSubmit={addProject}>
              <div className="form-grid">
                <label>Project title *<input value={title} onChange={e=>{setTitle(e.target.value);setSlug(e.target.value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));}} required minLength={2} maxLength={180} placeholder="e.g. Identity for a new brand" /></label>
                <label>URL slug *<input value={slug} onChange={e=>setSlug(e.target.value.toLowerCase())} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="identity-for-a-new-brand" /></label>
                <label>Service category *<select value={category} onChange={e=>setCategory(e.target.value)}><option>Branding & Design</option><option>Re-branding</option><option>Graphic Design</option><option>Print</option><option>Photography</option><option>Videography</option><option>Data Analysis</option><option>PR & Communications</option><option>Content Production</option><option>Other</option></select></label>
                <label>Cover artwork or video<input id="portfolio-media" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" onChange={handleFile}/><small>JPG, PNG, WebP, AVIF, MP4, WebM or MOV · up to 50 MB</small></label>
                <label className="field-full">Project summary *<textarea value={summary} onChange={e=>setSummary(e.target.value)} required minLength={10} maxLength={1000} rows={4} placeholder="What was created, for whom, and what makes the work worth showing?" /></label>
              </div>
              <div className="admin-checks"><label><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish this project</label><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)}/> Mark as featured</label></div>
              <button className="button button-blue" disabled={busy}>{busy ? "Saving project…" : "Save portfolio project ↗"}</button>
            </form>
          </section>
          <section className="admin-panel">
            <div className="admin-panel-head"><div><h2>Portfolio library</h2><p>{projects.length ? "Manage visibility or remove a project." : "Your library is ready for its first approved project."}</p></div><span>{projects.length} ITEMS</span></div>
            {projects.length===0 ? <div className="admin-empty"><strong>No projects yet.</strong><br/>Add your first project using the form. Keep unpublished work as a draft until it is ready for public viewing.</div> : <div className="admin-project-list">{projects.map(project=><article className="admin-project-row" key={project.id}><div><strong>{project.title}</strong><p>{project.category} · /{project.slug}</p><span className={project.published?"status-live":"status-draft"}>{project.published?"Published":"Draft"}{project.featured?" · Featured":""}</span></div><div className="admin-row-actions"><button className="button button-outline-dark" onClick={()=>togglePublished(project)} disabled={busy}>{project.published?"Unpublish":"Publish"}</button><button className="button button-danger" onClick={()=>deleteProject(project)} disabled={busy}>Delete</button></div></article>)}</div>}
          </section>
        </div>
      </>}
    </div>
  </section>;
}
