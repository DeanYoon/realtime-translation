"use client";
import TextCard from "@/components/text-card";
import { supabase } from "@/lib/supabase-client";
import { Message } from "@/types/collection";
import { useCallback, useEffect, useState } from "react";

export async function getData() {
  const { data, error } = await supabase.from("messages").select();
  // console.log(data);
  if (error) {
    console.error("error", error);
    return;
  } else {
    return data as Message[];
  }
}
export default async function Home() {
  const messages = await getData();

  return (
    <div className="flex  flex-col w-screen  h-screen ">
      {messages &&
        messages.map((message) => (
          <TextCard key={message.id} message={message} />
        ))}
    </div>
  );
}
