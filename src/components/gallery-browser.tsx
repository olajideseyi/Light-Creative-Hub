"use client";

import { useMemo, useState } from "react";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  kind: "image" | "video";
  projectUrl: string;
};

export function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("All work");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const filters = useMemo(() => ["All work", "Photography", "Video", ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const visible = items.filter((item) => {
    if (filter === "All work") return true;
    if (filter === "Photography") return item.kind === "image";
    if (filter === "Video") return item.kind === "video";
    return item.category === filter;
  });

  return (
    <>
      <div className="gallery-toolbar">
        <div className="gallery-filter-list" role="group" aria-label="Filter gallery">
          {filters.map((item) => <button type="button" key={item} className={filter === item ? "gallery-filter is-active" : "gallery-filter"} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <span className="gallery-count">{visible.length.toString().padStart(2, "0")} ITEMS</span>
      </div>
      {visible.length ? (
        <div className="gallery-grid">
          {visible.map((item, index) => (
            <article className={index % 5 === 0 ? "gallery-tile gallery-tile-tall" : "gallery-tile"} key={item.id}>
              <button className="gallery-media-button" type="button" onClick={() => setSelected(item)} aria-label={`View ${item.title}`}>
                {item.kind === "video" ? <video src={item.url} muted playsInline preload="metadata" aria-label={item.title} /> : <img src={item.url} alt={item.title} loading="lazy" />}
                <span className="gallery-media-open">{item.kind === "video" ? "▶ PLAY VIDEO" : "↗ VIEW IMAGE"}</span>
              </button>
              <div className="gallery-tile-caption"><div><span>{item.category}</span><h2>{item.title}</h2></div><a href={item.projectUrl} aria-label={`View project: ${item.title}`}>↗</a></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <span className="gallery-empty-mark">LC / 001</span>
          <h2>The next story starts here.</h2>
          <p>There are no published photos or videos in this collection yet. Add media to a project in the Studio CMS and publish it to build your gallery.</p>
          <a className="studio-button studio-button-blue" href="/admin">Go to the Studio CMS ↗</a>
        </div>
      )}
      {selected && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
        <button className="gallery-lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Close media viewer">×</button>
        <div className="gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
          {selected.kind === "video" ? <video src={selected.url} controls autoPlay playsInline /> : <img src={selected.url} alt={selected.title} />}
          <div className="gallery-lightbox-caption"><span>{selected.category}</span><h2>{selected.title}</h2><a href={selected.projectUrl}>View project ↗</a></div>
        </div>
      </div>}
    </>
  );
}
