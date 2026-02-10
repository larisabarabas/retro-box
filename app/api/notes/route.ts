import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";

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
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: To be removed later - '00000000-0000-0000-0000-000000000001' - this is just a fallback
    const team_id = body.team_id || "00000000-0000-0000-0000-000000000001";
    const { content, author_name, sprint_number = 1, source = "web" } = body;

    if (!content || !author_name) {
      return NextResponse.json(
        { error: "content and author_name required" },
        { status: 400 },
      );
    }

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from("notes")
      .insert({
        team_id,
        content,
        author_name,
        sprint_number,
        source,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
