"use client";
import { Input } from "@/components/input";
import Nav from "@/components/navigator";
import TextCard from "@/components/text-card";
import { useDBStore } from "@/lib/store";
import { RefObject, useEffect, useRef, useState } from "react";

export interface IMessage {
  id: number;
  input: string;
  translated: string | null;
}

export default function Home() {
  const currentChannelId = useDBStore((state) => state.channel);
  const userId = useDBStore((state) => state.user);
  const messages = useDBStore((state) => state.messages);
  const fetchMessages = useDBStore((state) => state.fetchMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScrollToBottom = (scrollRef: RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // 맨밑으로 스크롤
    }
  };

  useEffect(() => {
    currentChannelId && fetchMessages(currentChannelId, userId);
    handleScrollToBottom(scrollRef);
  }, [currentChannelId]);
  return (
    <div className="flex  w-screen  h-screen">
      <Nav />
      <div
        className="flex flex-col w-full items-center justify-center overflow-scroll "
        ref={scrollRef}
      >
        <div className=" pb-8 h-full  w-1/3   min-w-80 ">
          {messages &&
            messages.map((message) => (
              <TextCard key={message.id} message={message} />
            ))}
          <div className="h-16"></div>
        </div>

        <Input
          scrollRef={scrollRef}
          handleScrollToBottom={() => handleScrollToBottom(scrollRef)}
        />
      </div>
    </div>
  );
}
