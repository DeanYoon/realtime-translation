"use client";

import { language } from "@/lib/language";
import { useDBStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-client";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";

import { FormEvent, RefObject, useEffect, useState } from "react";

interface Props {
  scrollRef: RefObject<HTMLDivElement>;
  handleScrollToBottom: () => void;
}

export function Input(props: Props) {
  const currentChannelId = useDBStore((state) => state.channel);
  const userId = useDBStore((state) => state.user);
  const fetchMessages = useDBStore((state) => state.fetchMessages);
  const addDataUI = useDBStore((state) => state.addDataUI);

  const [inputLang, setInputLang] = useState(language.JP);
  const [outputLang, setOutputLang] = useState(language.KR);
  const [text, setText] = useState("");
  const [isMicOn, setIsMicOn] = useState(false);
  const [isInputJP, setIsInputJP] = useState(false);

  const { handleScrollToBottom } = props;

  const sendData = async () => {
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
        lang: outputLang,
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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const mic = new SpeechRecognition();
    mic.interimResults = true;
    mic.lang = inputLang;

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setText(transcript);
    };
    setIsMicOn(true);
    mic.start();

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
  }, [isMicOn, inputLang, outputLang]);

  const handleToggle = () => {
    setIsInputJP(!isInputJP);
  };

  useEffect(() => {
    setInputLang(isInputJP ? language.JP : language.KR);
    setOutputLang(isInputJP ? language.KR : language.JP);
  }, [isInputJP]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendData();
  };
  return (
    <div
      className="  flex
     w-1/2 min-w-80  bg-black fixed bottom-0"
    >
      <p onClick={onMicClick} className="cursor-pointer absolute -left-10">
        <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
      </p>

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

      <div className="fixed right-10 top-10">
        <div className="flex items-center">
          <button
            onClick={handleToggle}
            className={`border text-white font-bold py-2 px-4 rounded focus:outline-none`}
          >
            {isInputJP ? "JP→KR" : "KR→JP"}
          </button>
        </div>
      </div>
    </div>
  );
}
