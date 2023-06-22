"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Share_Tech_Mono } from "next/font/google";
import { AiDetectInput, AiDetectOutput } from "../api/aidetect/route";
import useSWRMutation from "swr/mutation";
import AiSprite from "../../components/AiSprite";
import ChatMessageBox from "../../components/ChatMessageBox";
import AiMoodBar from "../../components/AiMoodBar";

const AiFont = Share_Tech_Mono({ weight: "400", subsets: ["latin"] });

export default function Chat() {
  const inputField = useRef<HTMLInputElement>(null!)
  const [inputDisabled, setInputDisabled] = useState(true)
  const [moodDecaying, setMoodDecaying] = useState(false)
  const { messages, input, error: chatError, handleInputChange, handleSubmit, append } = useChat({
    onFinish: () => {
      setMoodDecaying(true)
      setInputDisabled(false)
    },
    onError: () => {
      setMoodDecaying(true)
      setInputDisabled(false)
    }
  });
  const [lastInput, setLastInput] = useState("");
  const [aiMood, setAiMood] = useState(1.0);
  const [killPhrase, setKillPhrase] = useState('')

  useEffect(() => {
    append({role:'system', content: `
    Initiate the conversation with a random topic.
    `})
  }, [])

  useEffect(()=>{
    if (!inputDisabled)
      inputField.current.focus()
  }, [inputDisabled])

  const {
    data: aiDetectData,
    error: aiDetectError,
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

  useEffect(() => {
    if (aiMood <= 0) {
      setKillPhrase("killphrase killphrase killphrase killphrase")
      setInputDisabled(false)
      return
    }
    if (moodDecaying) {
      const interval = setInterval(() => {
        if (moodDecaying) setAiMood(Math.max(0, aiMood - 0.0001));
      }, 10);
      return () => clearInterval(interval);
    }
  }, [aiMood, moodDecaying]);

  const lastAiMessage = messages.findLast((m) => m.role === "assistant");

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch select-none">
      <AiSprite mood={aiMood} />

      {aiMood > 0 && <ChatMessageBox fontClass={AiFont.className} content={
        chatError ? chatError.message : lastAiMessage ? lastAiMessage.content : ''}/>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (aiMood <= 0) {
            if (killPhrase === input) {
              // kill the robot
            }

            return
          }
          setInputDisabled(true)
          setLastInput(input);
          setMoodDecaying(false)
          trigger(input);
          handleSubmit(e);
        }}
      >
        <input
          autoFocus={true}
          ref={inputField}
          className="fixed bottom-0 w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          disabled={inputDisabled}
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

      {aiMood <= 0 && <div className="fixed bottom-24 w-full max-w-xl p-2 mb-8">
          ENTER KILLPHRASE!
      </div>}
      <div className="fixed bottom-16 w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl">
        {aiMood > 0 ? <AiMoodBar mood={aiMood} /> : killPhrase}
      </div>
    </div>
  );
}
