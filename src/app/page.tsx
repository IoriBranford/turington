"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { Share_Tech_Mono } from "next/font/google";
import { AiDetectInput, AiDetectOutput } from "./api/aidetect/route";
import useSWRMutation from "swr/mutation";
import AiSprite from "../components/AiSprite";

const AiFont = Share_Tech_Mono({ weight: "400", subsets: ["latin"] });

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [lastInput, setLastInput] = useState("");
  const [aiMood, setAiMood] = useState(1.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiMood(Math.max(0, aiMood - 0.01));
    }, 1000);
    return () => clearInterval(interval);
  }, [aiMood]);

  const {
    data: aiDetectData,
    error,
    trigger,
    isMutating,
  } = useSWRMutation<AiDetectOutput, any, string, string>(
    "/api/aidetect",
    async (route, { arg }) => {
      const res = await fetch(route, {
        method: "POST",
        body: JSON.stringify({ input: arg } as AiDetectInput),
      });
      return await res.json();
    }
  );

  useEffect(()=>{
    if (!aiDetectData)
      return
    const score = aiDetectData.score;
    if (score) {
      const moodEffect = (score - 0.5) * 0.5;
      setAiMood(Math.max(0, Math.min(1, aiMood + moodEffect)));
    }
  }, [aiDetectData])

  const lastAiMessage = messages.findLast((m) => m.role !== "user");

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch select-none">
      <AiSprite mood={aiMood} />

      <div className="fixed top-0 w-full max-w-xl p-2 mt-8 border border-gray-300 rounded shadow-xl bg-white bg-opacity-75">
        <div className={AiFont.className}>
          {lastAiMessage ? lastAiMessage.content : null}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          setLastInput(input);
          trigger(input);
          handleSubmit(e);
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder={lastInput}
          onChange={handleInputChange}
          onPaste={(e) => {
            e.preventDefault();
            setAiMood(Math.max(0, aiMood - 0.1));
          }}
          onDrop={(e) => {
            e.preventDefault();
            setAiMood(Math.max(0, aiMood - 0.1));
          }}
        />
      </form>

      <div className="fixed bottom-16 w-full max-w-fit p-2 mb-8 border border-gray-300 rounded shadow-xl">
        {aiMood}
      </div>
    </div>
  );
}
