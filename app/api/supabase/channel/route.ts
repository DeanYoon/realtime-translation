import { supabase } from "@/lib/supabase-client";
import { NextResponse, NextRequest } from "next/server";
import { Message } from "postcss";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("userId", userId);
    if (error) {
      console.error("Error retrieving channels:", error);
      return console.error(error.message, { status: 500 });
    } else {
      return NextResponse.json({ data });
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return console.error("Invalid request body", { status: 400 });
  }
}
