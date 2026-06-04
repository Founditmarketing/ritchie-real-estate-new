import { runConcierge, type ChatMessage } from "@/lib/concierge";

export const runtime = "nodejs";

/**
 * Chat endpoint for "Ask Ritchie".
 *
 * Pluggable brain: today it runs the keyless, grounded concierge engine.
 * When an LLM key is present, this is the single place to route to a model
 * (using the same listing-search/area helpers as tools). The response shape
 * returned to the client never changes, so the UI doesn't care which brain
 * answered.
 */
export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.messages)) {
      messages = body.messages
        .filter(
          (m: unknown): m is ChatMessage =>
            !!m &&
            typeof (m as ChatMessage).content === "string" &&
            ((m as ChatMessage).role === "user" ||
              (m as ChatMessage).role === "assistant"),
        )
        .slice(-12) // keep the last few turns for context
        .map((m: ChatMessage) => ({
          role: m.role,
          content: m.content.slice(0, 800),
        }));
    }
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Seam for a future LLM upgrade — drop in a key and route here.
  // if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
  //   return Response.json(await runLLMConcierge(messages));
  // }

  try {
    const reply = await runConcierge(messages);
    return Response.json(reply);
  } catch (err) {
    console.error("[ask-ritchie] concierge error:", err);
    return Response.json(
      {
        reply:
          "Something glitched on my end — give me a second and try again, or call Matt directly at 318-449-8919.",
      },
      { status: 200 },
    );
  }
}
