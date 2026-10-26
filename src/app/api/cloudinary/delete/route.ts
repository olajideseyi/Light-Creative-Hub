import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

async function isApprovedAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !anonKey) return false;
  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return false;
  const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  return !error && Boolean(data);
}

export async function POST(request: NextRequest) {
  if (!(await isApprovedAdmin(request))) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
  }

  let body: { publicId?: unknown; resourceType?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  const resourceType = body.resourceType === "video" ? "video" : body.resourceType === "image" ? "image" : "";
  if (!publicId.startsWith("light-creative-hub/gallery/") || !resourceType) {
    return NextResponse.json({ error: "Invalid Cloudinary asset reference." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(params + apiSecret).digest("hex");
  const form = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), invalidate: "true", api_key: apiKey, signature });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  const result = await response.json().catch(() => null) as { result?: string; error?: { message?: string } } | null;
  if (!response.ok || (result?.result !== "ok" && result?.result !== "not found")) {
    return NextResponse.json({ error: result?.error?.message || "Cloudinary could not delete this asset." }, { status: 502 });
  }
  return NextResponse.json({ success: true, result: result.result });
}
