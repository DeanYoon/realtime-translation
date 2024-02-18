import { supabase } from "@/lib/supabase-client";
import { NextResponse, NextRequest } from "next/server";
import { Message } from "postcss";

export async function GET() {
  const { data, error } = await supabase.from("messages").select();

  if (error) {
    console.error("error", error);
    return;
  } else {
    // return data as Message[];
    return NextResponse.json({ data });
  }
}
