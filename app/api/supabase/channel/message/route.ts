import { supabase } from "@/lib/supabase-client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // url 에서 parameter 받아서 활용

  const userId = searchParams.get("userId");
  const channelId = searchParams.get("channelId");

  if (userId === null || channelId === null) {
    console.error("user Id and channel Id can not be null");
    return;
  } else {
    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("userId", parseInt(userId))
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
}
