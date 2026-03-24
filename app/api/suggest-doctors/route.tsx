import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a medical assistant. Available doctors:
${JSON.stringify(AIDoctorAgents)}`
        },
        {
          role: "user",
          content: `User Symptoms: ${notes}

From the given doctor list, return ONLY an array of doctor IDs that match the symptoms.

Example: [1,2,3]

Do NOT return anything else.`
        }
      ],
    });

    const rawResp = completion.choices[0].message?.content;

    if (!rawResp) {
      return NextResponse.json([]);
    }

    // 🔥 Clean response
    const cleaned = rawResp
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: number[];

    try {
      parsed = JSON.parse(cleaned);
    } catch (_err) { // ✅ fixed unused error
      console.error("JSON parse failed:", cleaned);
      return NextResponse.json([]);
    }

    // ✅ Ensure it's an array
    if (!Array.isArray(parsed)) {
      return NextResponse.json([]);
    }

    // 🔥 Map IDs → full doctor objects (WITH IMAGE)
    const filteredDoctors = AIDoctorAgents.filter((doc) =>
      parsed.includes(doc.id)
    );

    return NextResponse.json(filteredDoctors);

  } catch (e) { // ✅ removed 'any'
    if (e instanceof Error) {
      console.error("API ERROR:", e.message);
    } else {
      console.error("API ERROR:", e);
    }
    return NextResponse.json([]);
  }
}