"use client";

import { useDBStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-client";
import {
  faMicrophone,
  faMicrophoneAlt,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";
// import { translateText } from "@/lib/translate-text";
import { FormEvent, RefObject, useEffect, useState } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
  handleScrollToBottom: () => void;
}

export function Input(props: Props) {
  const currentChannelId = useDBStore((state) => state.channel);
  const userId = useDBStore((state) => state.user);

  const [text, setText] = useState("");
  const fetchMessages = useDBStore((state) => state.fetchMessages);
  const addDataUI = useDBStore((state) => state.addDataUI);
  const [isMicOn, setIsMicOn] = useState(false);
  const { handleScrollToBottom } = props;

  let SpeechRecognition;
  let mic: SpeechRecognition;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendData();
  };
  const sendData = async (mic?: SpeechRecognition) => {
    setText("");
    await addDataUI({
      input: text,
      id: 1,
      translated: null,
    });
    handleScrollToBottom();

    const response = await axios.post(
      "api/translate",
      JSON.stringify({
        text: [text],
      })
    );

    const translatedData = response?.data[0].text;

    const newData = {
      input: text,
      userId: userId,
      channelId: currentChannelId,
      translated: translatedData,
    };
    const { error } = await supabase.from("messages").insert([newData]); //array 형태로 집어넣어야함

    if (error) {
      console.error(error.message);
    } else {
      await fetchMessages(currentChannelId, userId);
      handleScrollToBottom();
    }
  };

  const onMic = () => {
    SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    mic = new SpeechRecognition();
    // mic.continuous = true;
    mic.interimResults = true;
    mic.lang = "ja-JP";

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setText(transcript);
    };
    setIsMicOn(true);
    mic.start();

    // mic.onspeechstart = () => {
    //   console.log("Speech has been detected");
    // };

    // mic.onresult = (event) => {
    //   const color = event.results[0][0];
    //   console.log(color);
    // };

    mic.onspeechend = async () => {
      setIsMicOn(false);
    };
  };

  const onMicClick = () => {
    onMic();
  };

  useEffect(() => {
    handleScrollToBottom();
    !isMicOn && onMic();
    text && !isMicOn && sendData();
  }, [isMicOn]);
  return (
    <div
      className="  flex
     w-1/2 min-w-80  bg-black fixed bottom-0"
    >
      <form onSubmit={onSubmit} className="  h-8 w-full relative">
        <textarea
          value={text}
          placeholder="Speak to translate"
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full bg-white h-full text-black px-2 resize-none"
        />
        <button className=" absolute  -right-20 text-black bg-fuchsia-400">
          Send
        </button>
      </form>
      <div>
        <p onClick={onMicClick} className="cursor-pointer absolute -left-10">
          <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
        </p>
      </div>
    </div>
  );
}
