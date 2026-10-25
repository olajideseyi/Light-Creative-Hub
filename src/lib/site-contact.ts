import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SiteContact = {
  whatsappPhone: string;
  whatsappMessage: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
};

const defaults: SiteContact = {
  whatsappPhone: "2347067376478",
  whatsappMessage: "Hello Light Creative Hub, I’d like to discuss a project.",
  primaryPhone: "0706 737 6478",
  secondaryPhone: "0904 521 8491",
  email: "lightcreativehub0@gmail.com"
};

export async function getSiteContact(): Promise<SiteContact> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("site_content").select("content_value").eq("content_key", "contact").maybeSingle();
    if (error || !data?.content_value) return defaults;
    const value = data.content_value as Partial<SiteContact>;
    return {
      whatsappPhone: typeof value.whatsappPhone === "string" ? value.whatsappPhone : defaults.whatsappPhone,
      whatsappMessage: typeof value.whatsappMessage === "string" ? value.whatsappMessage : defaults.whatsappMessage,
      primaryPhone: typeof value.primaryPhone === "string" ? value.primaryPhone : defaults.primaryPhone,
      secondaryPhone: typeof value.secondaryPhone === "string" ? value.secondaryPhone : defaults.secondaryPhone,
      email: typeof value.email === "string" ? value.email : defaults.email
    };
  } catch {
    return defaults;
  }
}
