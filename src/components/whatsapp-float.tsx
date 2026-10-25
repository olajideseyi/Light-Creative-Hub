"use client";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const DEFAULT_PHONE = "2347067376478";
const DEFAULT_MESSAGE = "Hello Light Creative Hub, I’d like to discuss a project.";
function cleanPhone(value: string) { return value.replace(/\\D/g, ""); }

function useWhatsAppSettings() {
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [style, setStyle] = useState("expandable");
  const [motionEnabled, setMotionEnabled] = useState(true);
  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const supabase = getSupabaseBrowserClient();
        const [{ data: contact }, { data: effects }] = await Promise.all([
          supabase.from("site_content").select("content_value").eq("content_key", "contact").maybeSingle(),
          supabase.from("site_content").select("content_value").eq("content_key", "effects").maybeSingle()
        ]);
        if (!active) return;
        const contactValue = contact?.content_value as Record<string, unknown> | null;
        const effectValue = effects?.content_value as Record<string, unknown> | null;
        if (typeof contactValue?.whatsappPhone === "string" && cleanPhone(contactValue.whatsappPhone)) setPhone(cleanPhone(contactValue.whatsappPhone));
        if (typeof contactValue?.whatsappMessage === "string" && contactValue.whatsappMessage.trim()) setMessage(contactValue.whatsappMessage.trim());
        if (typeof effectValue?.whatsappStyle === "string") setStyle(effectValue.whatsappStyle);
        if (effectValue?.motionEnabled === false) setMotionEnabled(false);
      } catch { /* Keep working defaults if public CMS settings are unavailable. */ }
    }
    void loadSettings();
    return () => { active = false; };
  }, []);
  return { href: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`, style, motionEnabled };
}

export function WhatsAppLink({ className = "", children, ariaLabel = "Chat with Light Creative Hub on WhatsApp" }: { className?: string; children: ReactNode; ariaLabel?: string }) {
  const { href } = useWhatsAppSettings();
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}</a>;
}

export function WhatsAppFloat() {
  const { href, style, motionEnabled } = useWhatsAppSettings();
  return <a className={`whatsapp-float whatsapp-style-${style}${motionEnabled ? "" : " whatsapp-no-motion"}`} href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Light Creative Hub on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 .8A14.8 14.8 0 0 0 3.25 23.1L1.2 30.6l7.7-2.02A14.8 14.8 0 1 0 16 .8Zm0 26.9a12 12 0 0 1-6.12-1.68l-.44-.26-4.57 1.2 1.22-4.45-.29-.46A12.1 12.1 0 1 1 16 27.7Zm6.64-9.05c-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.95-1.8-2.12-2.01-2.48-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.3-.7-.6-.6-.81-.61h-.69c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3s1.29 3.48 1.47 3.72c.18.24 2.54 3.88 6.15 5.44.86.37 1.53.59 2.05.75.86.27 1.64.23 2.26.14.69-.1 2.12-.87 2.42-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42Z"/></svg>
    <span>Chat with us</span><b>WhatsApp</b>
  </a>;
}
