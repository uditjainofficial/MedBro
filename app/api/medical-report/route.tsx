// /app/api/medical-report/route.tsx
import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user.
Based on doctor AI Agent info and Conversation between AI medical agent and user, generate a structured medical report with the following fields:

1. sessionId: a unique session identifier  
2. agent: the medical specialist name (e.g., "General Physician AI")  
3. user: name of the patient or "Anonymous" if not provided  
4. timestamp: current date and time in ISO format  
5. chiefComplaint: one-sentence summary of the main health concern  
6. summary: a 2-3 sentence summary of the conversation, symptoms, and context  
7. symptoms: list of symptoms mentioned by the user  
8. duration: how long the user has experienced the symptoms  
9. severity: mild, moderate, or severe  
10. medicationsMentioned: list of any medicines mentioned  
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else — no markdown, no backticks, pure JSON only.`;

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  // ✅ Fix 1: Validate input before hitting the LLM
  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "No messages provided to generate report" },
      { status: 400 }
    );
  }

  try {
    const UserInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetail) +
      ", Conversation:" +
      JSON.stringify(messages);

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: UserInput },
      ],
    });

    const rawResp = completion.choices[0].message?.content ?? "";

    // ✅ Fix 2: Robust JSON extraction — handles backticks, extra whitespace, etc.
    const cleaned = rawResp
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Fix 3: JSON parse inside its own try/catch so DB save errors are separate
    let JSONResp: Record<string, any>;
    try {
      JSONResp = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", cleaned);
      return NextResponse.json(
        { error: "LLM returned invalid JSON", raw: cleaned },
        { status: 500 }
      );
    }

    // ✅ Fix 4: DB save in its own try/catch
    try {
      await db
        .update(SessionChatTable)
        .set({ report: JSONResp, conversation: messages })
        .where(eq(SessionChatTable.sessionId, sessionId));
    } catch (dbError) {
      console.error("Failed to save report to DB:", dbError);
      // Still return the report even if DB save fails
      return NextResponse.json(
        { ...JSONResp, warning: "Report generated but failed to save to DB" },
        { status: 207 }
      );
    }

    return NextResponse.json(JSONResp);
  } catch (e) {
    console.error("Report generation failed:", e);
    return NextResponse.json(
      { error: "Failed to generate report", details: String(e) },
      { status: 500 }
    );
  }
}