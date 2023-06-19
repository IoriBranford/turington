"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { Share_Tech_Mono } from "next/font/google";
import { AiDetectInput, AiDetectOutput } from "./api/aidetect/route";
import useSWRMutation from "swr/mutation";

const AiFont = Share_Tech_Mono({ weight: "400", subsets: ["latin"] });

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [lastInput, setLastInput] = useState("");

  const {
    data: aiDetectData,
    error,
    trigger,
    isMutating,
  }: {
    data: AiDetectOutput;
    error: any;
    trigger: (s: string) => {};
    isMutating: boolean;
  } = useSWRMutation(
    "/api/aidetect",
    async (route, { arg }: { arg: string }) => {
      const res = await fetch(route, {
        method: "POST",
        body: JSON.stringify({ input: arg } as AiDetectInput),
      });
      return await res.json();
    }
  );

  const lastAiMessage = messages.findLast((m) => m.role !== "user");

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch select-none">
      {lastAiMessage ? (
        <div className="fixed top-0 w-full max-w-md p-2 mt-8 border border-gray-300 rounded shadow-xl ">
          <div className={AiFont.className}>{lastAiMessage.content}</div>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          setLastInput(input);
          trigger(input);
          handleSubmit(e);
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder={lastInput}
          onChange={handleInputChange}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />
      </form>

      <div className="fixed bottom-16 w-full max-w-xs p-2 mb-8 border border-gray-300 rounded shadow-xl">
        {isMutating
          ? "Analyzing..."
          : error
          ? error.toString()
          : !aiDetectData
          ? "No data"
          : aiDetectData.error
          ? aiDetectData.error.msg
          : aiDetectData.score
          ? `${Math.floor(aiDetectData.score * 100)}% AI`
          // : aiDetectData.errors
          // ? aiDetectData.errors.map((e) => e.description).join("\n")
          // : aiDetectData.scores
          // ? aiDetectData.scores
          //     .map(
          //       (score) => `${Math.floor(score.score * 100)}% ${score.label}`
          //     )
          //     .join(", ")
          : "No scores"}
      </div>
    </div>
  );
}
