import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "No user found" });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  // ✅ FIX: ensure email is defined
  if (!email) {
    return NextResponse.json({ error: "Email not found" });
  }

  try {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }

    const result = await db
      .insert(usersTable)
      .values({
        name: user.fullName || "Unknown",
        email: email, // ✅ now safe
        credits: 10,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("USER ERROR:", e);
    return NextResponse.json(e);
  }
}