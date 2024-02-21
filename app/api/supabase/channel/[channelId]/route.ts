import { supabase } from "@/lib/supabase-client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request, context: any) {
  const { params } = context;
  const channelId = params.channelId;
  const { userId } = await request.json();
  const { data, error } = await supabase
    .from("messages")
    .select()
    .eq("userId", userId)
    .eq("channelId", channelId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("error", error);
    return;
  } else {
    // return data as Message[];
    return NextResponse.json({ data });
  }
}
