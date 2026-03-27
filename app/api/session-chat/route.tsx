import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  try {
    const sessionId = uuidv4();

    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: email, // ✅ REAL USER EMAIL
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("SESSION INSERT ERROR:", e);
    return NextResponse.json({ error: "Failed to create session" });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "No sessionId" });
  }

  const result = await db
    .select()
    .from(SessionChatTable)
    .where(eq(SessionChatTable.sessionId, sessionId));

  return NextResponse.json(result[0]);
}