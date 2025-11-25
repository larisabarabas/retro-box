import { supabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from("test_connection")
    .select("*")
    .limit(1);

  return NextResponse.json({ ok: !error, data, error });
}
