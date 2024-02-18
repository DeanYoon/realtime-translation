"use client";
import { IMessage } from "@/app/page";
import { useDBStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-client";
import { Message } from "@/types/collection";
import axios from "axios";
// import { translateText } from "@/lib/translate-text";
import { FormEvent, useState } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export function Input() {
  const [text, setText] = useState("");
  const refreshDB = useDBStore((state) => state.refreshDB);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setText("");

    const response = await axios.post(
      "api/translate",
      JSON.stringify({
        text: [text],
        target_lang: "KO",
      })
    );
    const translatedData = response?.data[0].text;

    const newData = {
      input: text,
      userId: 1,
      channelId: 1,
      translated: translatedData,
    };
    const { error } = await supabase.from("messages").insert([newData]); //array 형태로 집어넣어야함

    if (error) {
      console.error(error.message);
    } else {
      refreshDB();
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="absolute w-full h-8  bottom-0 ">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          type="text"
          className="w-full bg-white h-full text-black px-2"
        />
      </form>
      <div>
        {/* <p>Microphone: {listening ? "on" : "off"}</p>
        <button onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p> */}
      </div>
    </div>
  );
}
