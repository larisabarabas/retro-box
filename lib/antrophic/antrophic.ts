import Anthropic from "@anthropic-ai/sdk";

const antrophic = new Anthropic({
  apiKey: process.env.ANTROPHIC_API_KEY,
});

interface Note {
  content: string;
  author_name: string;
  created_at: string | null;
}

export async function generateSynthesis(
  notes: Note[],
  sprintNumber: number,
): Promise<string> {
  if (notes.length === 0) {
    throw new Error("No notes to synthesize");
  }

  const notesText = notes
    .map((note) => {
      let date = "unknown-date";
      if (note.created_at) {
        const parsedDate = new Date(note.created_at);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split("T")[0];
        }
      }
      return `[${date}] ${note.author_name}: ${note.content}`;
    })
    .join("\n");

  const response = await antrophic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are helping a software team prepare for their sprint retrospective.

        Here are notes team members captured throughout Sprint ${sprintNumber}:

        ${notesText}

        Synthesize these notes into a retro summary with:

        1. **Key Themes** - Group related notes into 2-4 main themes. Each theme should have:
        - A clear title
        - Which notes relate to it (cite by author/date)
        - Why this matters

        2. **Recurring Patterns** - Any issues mentioned multiple times or by multiple people

        3. **Suggested Actions** - 2-3 concrete, specific action items (not vague like "improve communication")

        Keep it concise and actionable. This will be read at the start of the retro meeting.`,
      },
    ],
  });

  const block = response.content[0];
  if (block?.type === "text") {
    return block.text;
  }
  throw new Error("Unexpected response format from Anthropic API");
}
