"use client";
import { Input } from "@/components/input";
import TextCard from "@/components/text-card";
import { useDBStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-client";
import { Message } from "@/types/collection";
import axios from "axios";
import { RefObject, useEffect, useRef, useState } from "react";

export interface IMessage {
  id: number;
  input: string;
  translated: string | null;
}
const handleScrollToBottom = (scrollRef: RefObject<HTMLDivElement>) => {
  if (scrollRef.current) {
    scrollRef.current.scrollIntoView(false); // 맨밑으로 스크롤
  }
};

export default function Home() {
  const messages = useDBStore((state) => state.DBData);
  const refreshDB = useDBStore((state) => state.refreshDB);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleScrollToBottom(scrollRef);
    refreshDB();
  }, []);
  return (
    <div className="flex  flex-col w-screen  h-screen">
      <div className="">
        <div className=" pb-8 h-full " ref={scrollRef}>
          {messages &&
            messages.map((message) => (
              <TextCard key={message.id} message={message} />
            ))}
        </div>
        <Input
          scrollRef={scrollRef}
          handleScrollToBottom={() => handleScrollToBottom(scrollRef)}
        />
      </div>
    </div>
  );
}
