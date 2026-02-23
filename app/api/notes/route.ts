import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";

const defaultTeamId = process.env.NEXT_PUBLIC_DEFAULT_TEAM_ID;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("team_id") || defaultTeamId;
    const sprintNumber = searchParams.get("sprint_number");

    if (!teamId) {
      return NextResponse.json(
        { error: "Missing team_id and NEXT_PUBLIC_DEFAULT_TEAM_ID" },
        { status: 500 },
      );
    }

    const supabase = await supabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("notes")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    if (sprintNumber) {
      query = query.eq("sprint_number", parseInt(sprintNumber, 10));
    }

    const { data } = await query;

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
    const team_id = body.team_id || defaultTeamId;
    const { content, author_name, sprint_number = 1, source = "web" } = body;

    if (!team_id) {
      return NextResponse.json(
        { error: "Missing team_id and NEXT_PUBLIC_DEFAULT_TEAM_ID" },
        { status: 500 },
      );
    }

    if (!content || !author_name) {
      return NextResponse.json(
        { error: "content and author_name required" },
        { status: 400 },
      );
    }

    const supabase = await supabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
