import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

async function isApprovedAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
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
    return NextResponse.json({ error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the deployment environment." }, { status: 503 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "light-creative-hub/gallery";
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
