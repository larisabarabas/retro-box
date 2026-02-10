import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // TODO: To be removed later - '00000000-0000-0000-0000-000000000001' - this is just a fallback
    const teamId =
      searchParams.get("team_id") || "00000000-0000-0000-0000-000000000001";
    const sprintNumber = searchParams.get("sprint_number");

    const supabase = await supabaseServerClient();

    let query = supabase
      .from("notes")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    if (sprintNumber) {
      query = query.eq("sprint_number", parseInt(sprintNumber));
    }

    const { data, error } = await query;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
