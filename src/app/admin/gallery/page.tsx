"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type GalleryRecord = {
  id: string; title: string; description: string; category: string; media_url: string;
  media_type: "image" | "video"; alt_text: string; published: boolean; featured: boolean;
  display_order: number; created_at: string; cloudinary_public_id: string | null; cloudinary_resource_type: "image" | "video" | "raw" | null;
};
const BUCKET = "portfolio-media";
const MAX_SIZE = 50 * 1024 * 1024;
const CATEGORIES = ["Photography", "Photoshoot", "Brand Campaign", "Product", "Portrait", "Event", "Video", "Behind the Scenes", "Other"];
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.webp,.avif,.mp4,.webm,.mov,.m4v";
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm", "video/quicktime"]);
const isVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
function storageObjectPath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredUrl || url.origin !== new URL(configuredUrl).origin) return null;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    const encodedPath = url.pathname.slice(markerIndex + marker.length);
    return encodedPath ? encodedPath.split("/").map((part) => decodeURIComponent(part)).join("/") : null;
  } catch {
    return null;
  }
}


export default function AdminGalleryPage() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<GalleryRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [altText, setAltText] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentCloudinaryId, setCurrentCloudinaryId] = useState<string | null>(null);
  const [currentCloudinaryType, setCurrentCloudinaryType] = useState<"image" | "video" | "raw" | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    const { data, error: queryError } = await getSupabaseBrowserClient().from("gallery_items")
      .select("id,title,description,category,media_url,media_type,alt_text,published,featured,display_order,created_at,cloudinary_public_id,cloudinary_resource_type")
      .order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (queryError) throw queryError;
    setItems((data ?? []) as GalleryRecord[]);
  }, []);

  const verify = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw new Error("Please sign in with your approved studio administrator account.");
    const { data, error: accessError } = await client.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
    if (accessError || !data) throw new Error("This account is not approved to manage the gallery.");
  }, []);

  useEffect(() => {
    let active = true;
    const client = getSupabaseBrowserClient();
    client.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      if (data.session) {
        try { await verify(); await loadItems(); if (active) setSignedIn(true); }
        catch (e) { if (active) setError(e instanceof Error ? e.message : "Could not load gallery manager."); }
      }
      if (active) setReady(true);
    }).catch((e: unknown) => { if (active) { setError(e instanceof Error ? e.message : "Could not check sign-in."); setReady(true); } });
    return () => { active = false; };
  }, [loadItems, verify]);

  function reset() {
    setEditing(null); setTitle(""); setDescription(""); setCategory(CATEGORIES[0]); setAltText("");
    setPublished(true); setFeatured(false); setFile(null); setCurrentUrl(""); setCurrentCloudinaryId(null); setCurrentCloudinaryType(null);
    const input = document.getElementById("gallery-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function startEdit(item: GalleryRecord) {
    setEditing(item.id); setTitle(item.title); setDescription(item.description || ""); setCategory(item.category || CATEGORIES[0]);
    setAltText(item.alt_text || ""); setPublished(item.published); setFeatured(item.featured); setCurrentUrl(item.media_url); setCurrentCloudinaryId(item.cloudinary_public_id); setCurrentCloudinaryType(item.cloudinary_resource_type); setFile(null);
    document.getElementById("gallery-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const { error: authError } = await getSupabaseBrowserClient().auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      await verify(); await loadItems(); setSignedIn(true); setPassword(""); setNotice("Welcome back. Your gallery library is ready.");
    } catch (e) {
      await getSupabaseBrowserClient().auth.signOut();
      setError(e instanceof Error ? e.message : "Could not sign in.");
    } finally { setBusy(false); }
  }

  async function cloudinaryRequest(path: string, body: Record<string, unknown>) {
    const client = getSupabaseBrowserClient();
    const { data: sessionData } = await client.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("Your administrator session has expired. Sign in again.");
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const result = await response.json().catch(() => ({})) as { error?: string; success?: boolean };
    if (!response.ok) throw new Error(result.error || "Cloudinary request failed.");
    return result;
  }

  async function deleteCloudinaryAsset(publicId: string | null, resourceType: "image" | "video" | "raw" | null) {
    if (!publicId || (resourceType !== "image" && resourceType !== "video")) return true;
    try {
      await cloudinaryRequest("/api/cloudinary/delete", { publicId, resourceType });
      return true;
    } catch {
      return false;
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    let uploadedCloudinaryId: string | null = null;
    let uploadedCloudinaryType: "image" | "video" | "raw" | null = null;
    let databaseSaved = false;
    try {
      const client = getSupabaseBrowserClient();
      let mediaUrl = currentUrl;
      let mediaType: "image" | "video" = isVideo(currentUrl) ? "video" : "image";
      let cloudinaryPublicId = currentCloudinaryId;
      let cloudinaryResourceType = currentCloudinaryType;
      if (file) {
        if (file.size > MAX_SIZE) throw new Error("Choose a file smaller than 50 MB.");
        if (!ACCEPTED_TYPES.has(file.type)) throw new Error("Use a JPG, PNG, WebP, AVIF, MP4, WebM or MOV file.");
        const signature = await cloudinaryRequest("/api/cloudinary/signature", {});
        const signed = signature as unknown as { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string };
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signed.apiKey);
        form.append("timestamp", String(signed.timestamp));
        form.append("folder", signed.folder);
        form.append("signature", signed.signature);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`, { method: "POST", body: form });
        const result = await response.json().catch(() => ({})) as { secure_url?: string; public_id?: string; resource_type?: string; error?: { message?: string } };
        if (!response.ok || !result.secure_url || !result.public_id) throw new Error(result.error?.message || "Cloudinary could not upload this file.");
        mediaUrl = result.secure_url;
        mediaType = result.resource_type === "video" ? "video" : "image";
        cloudinaryPublicId = result.public_id;
        cloudinaryResourceType = result.resource_type === "video" ? "video" : "image";
        uploadedCloudinaryId = cloudinaryPublicId;
        uploadedCloudinaryType = cloudinaryResourceType;
      }
      if (!mediaUrl) throw new Error("Choose a photo or video before saving.");
      const payload = {
        title: title.trim(), description: description.trim(), category, media_url: mediaUrl, media_type: mediaType,
        cloudinary_public_id: cloudinaryPublicId, cloudinary_resource_type: cloudinaryResourceType,
        alt_text: altText.trim(), published, featured, updated_at: new Date().toISOString(),
        display_order: editing ? (items.find(item => item.id === editing)?.display_order ?? items.length) : items.length
      };
      const previousUrl = currentUrl;
      const previousCloudinaryId = currentCloudinaryId;
      const previousCloudinaryType = currentCloudinaryType;
      const result = editing ? await client.from("gallery_items").update(payload).eq("id", editing) : await client.from("gallery_items").insert(payload);
      if (result.error) throw result.error;
      databaseSaved = true;
      let oldMediaCleanupFailed = false;
      if (file && previousUrl && previousUrl !== mediaUrl) {
        if (previousCloudinaryId && previousCloudinaryId !== cloudinaryPublicId) {
          oldMediaCleanupFailed = !(await deleteCloudinaryAsset(previousCloudinaryId, previousCloudinaryType));
        } else {
          const previousPath = storageObjectPath(previousUrl);
          if (previousPath) {
            try {
              const { error: cleanupError } = await client.storage.from("portfolio-media").remove([previousPath]);
              oldMediaCleanupFailed = Boolean(cleanupError);
            } catch { oldMediaCleanupFailed = true; }
          }
        }
      }
      await loadItems();
      reset();
      setNotice(oldMediaCleanupFailed
        ? "Gallery item saved, but the previous media file could not be removed. You may need to clean it up in the media provider."
        : (editing ? "Gallery item updated." : "Media added to your gallery."));
    } catch (e) {
      if (uploadedCloudinaryId && !databaseSaved) {
        await deleteCloudinaryAsset(uploadedCloudinaryId, uploadedCloudinaryType);
      }
      setError(databaseSaved
        ? `Your gallery item was saved, but the page could not refresh: ${e instanceof Error ? e.message : "Unknown error"}. Refresh the page to see the saved item.`
        : (e instanceof Error ? e.message : "Could not save gallery item. Check your Cloudinary configuration and gallery migration."));
    } finally { setBusy(false); }
  }

  async function toggle(item: GalleryRecord) {
    setBusy(true); setError(""); setNotice("");
    try { const { error: updateError } = await getSupabaseBrowserClient().from("gallery_items").update({ published: !item.published, updated_at: new Date().toISOString() }).eq("id", item.id); if (updateError) throw updateError; await loadItems(); setNotice(`${item.title} is now ${item.published ? "a draft" : "published"}.`); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update item."); } finally { setBusy(false); }
  }

  async function remove(item: GalleryRecord) {
    if (!window.confirm(`Delete “${item.title}” and its uploaded file from the gallery?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const client = getSupabaseBrowserClient();
      const { error: deleteError } = await client.from("gallery_items").delete().eq("id", item.id);
      if (deleteError) throw deleteError;
      let storageCleanupFailed = false;
      if (item.cloudinary_public_id) {
        storageCleanupFailed = !(await deleteCloudinaryAsset(item.cloudinary_public_id, item.cloudinary_resource_type));
      } else {
        const path = storageObjectPath(item.media_url);
        if (path) {
          try {
            const { error: storageError } = await client.storage.from("portfolio-media").remove([path]);
            storageCleanupFailed = Boolean(storageError);
          } catch { storageCleanupFailed = true; }
        }
      }
      await loadItems(); if (editing === item.id) reset();
      setNotice(storageCleanupFailed
        ? "Gallery entry deleted. Its media file could not be removed from the provider and may need manual cleanup."
        : "Gallery entry and its uploaded file removed.");
    }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete gallery entry."); } finally { setBusy(false); }
  }

  const shown = useMemo(() => items.filter(item => filter === "all" || (filter === "published" ? item.published : !item.published)), [items, filter]);
  if (!ready) return <main className="gallery-admin-page"><div className="gallery-admin-loading">Loading studio workspace…</div></main>;

  return <main className="gallery-admin-page">
    <header className="gallery-admin-header">
      <a className="gallery-admin-brand" href="/admin"><span className="gallery-admin-logo">L</span><span><strong>LIGHT CREATIVE HUB</strong><small>STUDIO CMS / MEDIA LIBRARY</small></span></a>
      <nav aria-label="Admin navigation"><a href="/admin">Dashboard</a><a className="active" aria-current="page" href="/admin/gallery">Gallery manager</a><a href="/gallery" target="_blank" rel="noreferrer">View gallery ↗</a>{signedIn && <button type="button" onClick={async () => { await getSupabaseBrowserClient().auth.signOut(); setSignedIn(false); setItems([]); }}>Sign out</button>}</nav>
    </header>
    {!signedIn ? <div className="gallery-admin-login"><div><span className="cms-eyebrow">MEDIA WORKSPACE / ACCESS</span><h1>Your visual archive,<br/><em>under control.</em></h1><p>Sign in with the same approved administrator account used for the main Studio CMS.</p></div><form className="gallery-admin-form" onSubmit={signIn}><h2>Administrator sign in</h2>{error && <p role="alert" className="form-error">{error}</p>}<label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="button button-blue" disabled={busy}>{busy ? "Checking access…" : "Open gallery manager ↗"}</button></form></div> : <>
      <section className="gallery-admin-intro"><div><span className="cms-eyebrow">ADMIN WORKSPACE / MEDIA LIBRARY</span><h1>Manage the <em>visual archive.</em></h1><p>Upload photoshoots and video content directly. These items are independent of portfolio projects and can be published individually.</p></div><a className="button button-blue" href="/gallery" target="_blank" rel="noreferrer">Preview public gallery ↗</a></section>
      {error && <p role="alert" className="form-error gallery-admin-alert">{error}</p>}{notice && <p role="status" className="form-message gallery-admin-alert">{notice}</p>}
      <div className="gallery-admin-stats"><article><span>ALL MEDIA</span><strong>{items.length.toString().padStart(2,"0")}</strong><small>Images and videos in the library</small></article><article><span>PUBLISHED</span><strong>{items.filter(item=>item.published).length.toString().padStart(2,"0")}</strong><small>Visible on the public gallery</small></article><article><span>DRAFTS</span><strong>{items.filter(item=>!item.published).length.toString().padStart(2,"0")}</strong><small>Only visible in this workspace</small></article></div>
      <div className="gallery-admin-layout">
        <section className="gallery-admin-panel" id="gallery-editor"><div className="gallery-admin-panel-heading"><div><span className="cms-eyebrow">{editing ? "EDIT MEDIA" : "ADD TO GALLERY"}</span><h2>{editing ? "Update this item." : "Upload new work."}</h2><p>Add one image or video per entry. You can add as many entries as you need.</p></div>{editing && <button type="button" className="button button-outline-dark" onClick={reset}>Cancel edit</button>}</div>
          <form className="gallery-admin-form" onSubmit={save}><label>Photo or video file{currentUrl && <div className="gallery-admin-preview">{isVideo(currentUrl) ? <video src={currentUrl} controls playsInline preload="metadata"/> : <img src={currentUrl} alt={altText || title || "Gallery media preview"}/>}</div>}<input id="gallery-upload" type="file" accept={ACCEPT} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFile(e.target.files?.[0] ?? null)}/><small>JPG, PNG, WebP, AVIF, MP4, WebM or MOV. Maximum 50 MB per file. Files upload securely to Cloudinary when you save. A new upload replaces the current media for this entry.</small></label>
            {file && <p className="gallery-selected-file"><strong>Selected:</strong> {file.name} · {(file.size / (1024*1024)).toFixed(1)} MB</p>}
            <label>Display title<input value={title} onChange={e=>setTitle(e.target.value)} minLength={2} maxLength={180} required placeholder="e.g. Studio portrait series"/></label>
            <label>Gallery category<select value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(value=><option key={value}>{value}</option>)}</select></label>
            <label>Image alt text<input value={altText} onChange={e=>setAltText(e.target.value)} maxLength={300} placeholder="Describe the image for accessibility"/></label>
            <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={2000} rows={4} placeholder="Optional story, shoot details or video description"/></label>
            <div className="gallery-admin-checks"><label><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/> Publish to public gallery</label><label><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)}/> Mark as featured</label></div>
            <button className="button button-blue" disabled={busy}>{busy ? "Saving media…" : editing ? "Save changes ↗" : "Upload and save media ↗"}</button>
          </form>
        </section>
        <section className="gallery-admin-library"><div className="gallery-admin-panel-heading"><div><span className="cms-eyebrow">MEDIA LIBRARY</span><h2>Your gallery items</h2><p>Edit details, change visibility or remove entries.</p></div></div><div className="gallery-admin-filter">{(["all","published","drafts"] as const).map(value=><button type="button" key={value} className={filter===value?"active":""} onClick={()=>setFilter(value)}>{value==="all"?"All media":value==="published"?"Published":"Drafts"}</button>)}</div>
          {shown.length ? <div className="gallery-admin-items">{shown.map(item=><article className="gallery-admin-item" key={item.id}><div className="gallery-admin-item-media">{item.media_type==="video" ? <video src={item.media_url} muted playsInline preload="metadata"/> : <img src={item.media_url} alt={item.alt_text || item.title} loading="lazy"/>}</div><div className="gallery-admin-item-body"><div className="gallery-admin-item-top"><span>{item.category}</span><span className={item.published?"gallery-status-published":"gallery-status-draft"}>{item.published?"Published":"Draft"}</span></div><h3>{item.title}</h3><p>{item.description || "No description added."}</p><div className="gallery-admin-item-actions"><button type="button" onClick={()=>startEdit(item)}>Edit details</button><button type="button" onClick={()=>void toggle(item)} disabled={busy}>{item.published?"Unpublish":"Publish"}</button><button type="button" className="danger" onClick={()=>void remove(item)} disabled={busy}>Delete</button></div></div></article>)}</div> : <div className="gallery-admin-empty"><span>MEDIA LIBRARY / 001</span><h3>Your gallery starts here.</h3><p>Upload your first photoshoot image or video using the form. Save it as a draft or publish it immediately.</p></div>}
        </section>
      </div>
    </>}
  </main>;
}
