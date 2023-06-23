"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Share_Tech_Mono } from "next/font/google";
import { AiDetectInput, AiDetectOutput } from "../api/aidetect/route";
import useSWRMutation from "swr/mutation";
import AiSprite from "../../components/AiSprite";
import ChatMessageBox from "../../components/ChatMessageBox";
import AiMoodBar from "../../components/AiMoodBar";
import GameOverBlood from "@/src/components/GameOverBlood";

const AiFont = Share_Tech_Mono({ weight: "400", subsets: ["latin"] });

const KillTime = 10000

export default function Chat() {
  const inputField = useRef<HTMLInputElement>(null!)
  const [inputDisabled, setInputDisabled] = useState(true)
  const [moodDecaying, setMoodDecaying] = useState(false)
  const { messages, input, error: chatError, handleInputChange, handleSubmit, append, setInput } = useChat({
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
  const [aiAlive, setAiAlive] = useState(true)
  const [playerAlive, setPlayerAlive] = useState(true)
  const [killPhrase, setKillPhrase] = useState('')
  const [killTimer, setKillTimer] = useState(KillTime)

  useEffect(() => {
    append({role:'system', content: `Initiate the conversation with a random topic.`})
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
      setKillPhrase("killphrase")
      setKillTimer(KillTime)
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

  useEffect(() => {
    if (killPhrase === '')
      return
    if (killTimer <= 0) {
      setPlayerAlive(false)
      return
    }
    const interval = setInterval(() => {
      setKillTimer(killTimer - 10)
    }, 10);
    return () => clearInterval(interval);
  }, [killPhrase, killTimer])

  const lastAiMessage = messages.findLast((m) => m.role === "assistant");

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch select-none">
      <AiSprite mood={aiMood} alive={aiAlive} scale={1 + 4*(KillTime-killTimer)/KillTime} />

      <ChatMessageBox hidden={aiMood <= 0} fontClass={AiFont.className} content={
        chatError ? chatError.message : lastAiMessage ? lastAiMessage.content : ''}/>

      <form
        hidden={!aiAlive || !playerAlive}
        onSubmit={(e) => {
          e.preventDefault()
          if (aiMood <= 0) {
            if (aiAlive && killPhrase === input.trim().toLowerCase()) {
              setAiAlive(false)
              setKillPhrase('')
              setInput('')
              setInputDisabled(true)
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

      <div hidden={killPhrase === '' || !playerAlive} className="fixed bottom-24 w-full max-w-xl p-2 mb-8">
          ENTER KILLPHRASE!
      </div>
      <div hidden={!aiAlive || !playerAlive} className="fixed bottom-16 w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl">
        {aiMood > 0 ? <AiMoodBar mood={aiMood} /> : killPhrase}
      </div>
      <GameOverBlood hidden={playerAlive} />
    </div>
  );
}
