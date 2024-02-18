"use client";
import { Input } from "@/components/input";
import TextCard from "@/components/text-card";
import { useDBStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-client";
import { Message } from "@/types/collection";
import axios from "axios";
import { useEffect, useState } from "react";

export interface IMessage {
  id: number;
  input: string;
  translated: string | null;
}

export default function Home() {
  const messages = useDBStore((state) => state.DBData);
  const refreshDB = useDBStore((state) => state.refreshDB);

  // const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    refreshDB();
    // setMessages(initDB);
  }, []);
  return (
    <div className="flex  flex-col w-screen  h-screen ">
      {messages &&
        messages.map((message) => (
          <TextCard key={message.id} message={message} />
        ))}

      <Input />
    </div>
  );
}
