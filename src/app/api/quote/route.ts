import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().min(1).max(160),
  company: z.string().trim().max(160).optional().default(""),
  details: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default("")
});

export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); }
  catch { return NextResponse.json({ error: "Please submit a valid form." }, { status: 400 }); }

  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 201 });

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service,
      company: parsed.data.company || null,
      details: parsed.data.details,
      consent: true
    });
    if (error) {
      console.error("Enquiry save failed:", error.message);
      return NextResponse.json({ error: "We could not save your enquiry. Please try again or contact us directly." }, { status: 503 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "The enquiry service is not configured yet. Please contact us directly." }, { status: 503 });
  }
}
