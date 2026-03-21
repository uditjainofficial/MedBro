import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await currentUser();

  try {
    const users = await db.select().from(usersTable);

    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user?.fullName || "Unknown",
          email: user?.primaryEmailAddress?.emailAddress || "",
          credits: 10,
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(users[0]);
  } catch (e) {
    return NextResponse.json(e);
  }
}