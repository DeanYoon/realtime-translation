import { supabase } from "@/lib/supabase-client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId === null) {
      console.error("userId should not be null");
    } else {
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("userId", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error retrieving channels:", error);
        return console.error(error.message, { status: 500 });
      } else {
        return NextResponse.json({ data });
      }
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return console.error("Invalid request body", { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const newChannelName = searchParams.get("newChannel");
    const userId = searchParams.get("userId");

    if (userId === null || newChannelName === null) {
      console.error("parameter can not be null");
      return;
    } else {
      const newChannel = {
        channel_name: newChannelName,
        userId: parseInt(userId),
      };
      const { error } = await supabase.from("channels").insert([newChannel]);

      if (error) {
        console.error("Error retrieving channels:", error);
        return console.error(error.message, { status: 500 });
      } else {
        return new Response(null, { status: 201 });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
