"use client";

import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/safe-image";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filters = useMemo(
    () => Array.from(new Set(["All work", "Photography", "Video", ...items.map((item) => item.category).filter(Boolean)])),
    [items]
  );
  const visible = useMemo(() => items.filter((item) => {
    if (filter === "All work") return true;
    if (filter === "Photography") return item.kind === "image";
    if (filter === "Video") return item.kind === "video";
    return item.category === filter;
  }), [filter, items]);
  const selectedIndex = visible.findIndex((item) => item.id === selectedId);
  const selected = selectedIndex >= 0 ? visible[selectedIndex] : null;

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowRight" && selectedIndex < visible.length - 1) setSelectedId(visible[selectedIndex + 1].id);
      if (event.key === "ArrowLeft" && selectedIndex > 0) setSelectedId(visible[selectedIndex - 1].id);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, selectedIndex, visible]);

  const moveSelection = (direction: -1 | 1) => {
    const next = selectedIndex + direction;
    if (next >= 0 && next < visible.length) setSelectedId(visible[next].id);
  };

  return (
    <>
      <div className="gallery-toolbar">
        <div className="gallery-filter-list" role="group" aria-label="Filter gallery">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "gallery-filter is-active" : "gallery-filter"}
              aria-pressed={filter === item}
              onClick={() => { setFilter(item); setSelectedId(null); }}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="gallery-count" aria-live="polite">{visible.length.toString().padStart(2, "0")} ITEMS</span>
      </div>
      {visible.length ? (
        <div className="gallery-grid">
          {visible.map((item, index) => (
            <article className={`gallery-tile gallery-tile-${index % 6}`} key={item.id}>
              <button className="gallery-media-button" type="button" onClick={() => setSelectedId(item.id)} aria-label={`Open ${item.title} in media viewer`}>
                {item.kind === "video" ? (
                  <video src={item.url} muted playsInline preload="metadata" aria-label={item.title} />
                ) : (
                  <SafeImage src={item.url} alt={item.title} />
                )}
                <span className="gallery-media-open">{item.kind === "video" ? "▶ PLAY VIDEO" : "↗ VIEW IMAGE"}</span>
              </button>
              <div className="gallery-tile-caption">
                <div><span>{item.category}</span><h2>{item.title}</h2></div>
                <a href={item.projectUrl} aria-label={`View project: ${item.title}`}>↗</a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <span className="gallery-empty-mark">LC / 001</span>
          <h2>The next story starts here.</h2>
          <p>There are no published photos or videos in this collection yet. Upload new work in the Gallery Manager and publish it when you are ready.</p>
          <a className="studio-button studio-button-blue" href="/admin/gallery">Open Gallery Manager ↗</a>
        </div>
      )}
      {selected && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelectedId(null)}>
          <button className="gallery-lightbox-close" type="button" onClick={() => setSelectedId(null)} aria-label="Close media viewer">×</button>
          {selectedIndex > 0 && <button className="gallery-lightbox-nav gallery-lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(-1); }} aria-label="Previous item">←</button>}
          <div className="gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
            {selected.kind === "video" ? (
              <video key={selected.id} src={selected.url} controls autoPlay playsInline />
            ) : (
              <SafeImage key={selected.id} src={selected.url} alt={selected.title} />
            )}
            <div className="gallery-lightbox-caption">
              <div><span>{selected.category}</span><h2>{selected.title}</h2></div>
              <a href={selected.projectUrl}>View project ↗</a>
              <small>{String(selectedIndex + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</small>
            </div>
          </div>
          {selectedIndex < visible.length - 1 && <button className="gallery-lightbox-nav gallery-lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); moveSelection(1); }} aria-label="Next item">→</button>}
        </div>
      )}
    </>
  );
}
