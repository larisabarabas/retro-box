import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("test_connection")
    .select("*")
    .limit(1);

  return NextResponse.json({ ok: !error, data, error });
}
