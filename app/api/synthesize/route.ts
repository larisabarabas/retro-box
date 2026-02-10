import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";
import { generateSynthesis } from "@/lib/antrophic/antrophic";
import { getErrorMessage } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // TODO: To be removed later - '00000000-0000-0000-0000-000000000001' - this is just a fallback
    const team_id =
      searchParams.get("team_id") || "00000000-0000-0000-0000-000000000001";
    const sprint_number = searchParams.get("sprint_number") || "1";

    const supabase = await supabaseServerClient();

    const { data, error } = await supabase
      .from("syntheses")
      .select("*")
      .eq("team_id", team_id)
      .eq("sprint_number", parseInt(sprint_number))
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: To be removed later - '00000000-0000-0000-0000-000000000001' - this is just a fallback
    const team_id = body.team_id || "00000000-0000-0000-0000-000000000001";
    const { sprint_number = 1 } = body;

    const supabase = await supabaseServerClient();

    // Fetch notes

    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("content, author_name, created_at")
      .eq("team_id", team_id)
      .eq("sprint_number", sprint_number)
      .order("created_at", { ascending: true });

    if (notesError) throw notesError;

    if (!notes || notes.length === 0) {
      return NextResponse.json(
        { error: "No notes found for this sprint" },
        { status: 400 },
      );
    }

    // Create synthesis with Claude

    const synthesisText = await generateSynthesis(notes, sprint_number);

    // Save synthesis
    const { data: synthesis, error: synthesisError } = await supabase
      .from("syntheses")
      .insert({
        team_id,
        sprint_number,
        raw_output: synthesisText,
      })
      .select()
      .single();

    if (synthesisError) throw synthesisError;

    return NextResponse.json(synthesis);
  } catch (error: unknown) {
    console.error("Synthesis error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
