"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { Share_Tech_Mono } from "next/font/google";
import { AiDetectInput, AiDetectOutput } from "../api/aidetect/route";
import useSWRMutation from "swr/mutation";
import AiSprite from "../../components/AiSprite";
import ChatMessageBox from "../../components/ChatMessageBox";
import AiStatusBar from "@/src/components/AiStatusBar";
import GameOverBlood from "@/src/components/GameOverBlood";
import { generate } from "random-words";
import GameResult from "@/src/components/GameResult";

const AiFont = Share_Tech_Mono({ weight: "400", subsets: ["latin"] });

const KillTime = 5000

export default function Chat() {
  const inputField = useRef<HTMLInputElement>(null!)
  const [inputDisabled, setInputDisabled] = useState(true)
  const [moodDecaying, setMoodDecaying] = useState(false)
  const { messages, input, isLoading, error: chatError, handleInputChange, append, setInput } = useChat({
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
    append({role:'system', content: `
      Initiate a new conversation with a random topic.
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
      const newMood = Math.max(0, Math.min(1, aiMood + moodEffect))
      if (newMood > 0) {
        let tone = 'friendly'
        if (newMood < .2)
          tone = 'irritable'
        else if (newMood < .4)
          tone = 'dismissive'
        else if (newMood < .6)
          tone = 'neutral'

        append({
          content: lastInput + ` (Please respond in a ${tone} tone.)`,
          role: "user",
          createdAt: new Date(),
        });
      }
      setAiMood(newMood);
    }
  }, [aiDetectData])

  useEffect(() => {
    if (aiMood <= 0) {
      setKillPhrase(generate({
        exactly: 2,
        minLength: 8,
        maxLength: 8,
        join: ' '
      }))
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

  const lastMessage = messages[messages.length - 1]
  const messageBoxContent =
    (chatError ? chatError.message
      : !isMutating && lastMessage?.role == 'assistant' ? lastMessage.content : "")

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch select-none">
      <AiSprite
        mood={aiMood}
        alive={aiAlive}
        scale={1 + (8 * (KillTime - killTimer)) / KillTime}
      />

      <ChatMessageBox
        hidden={aiMood <= 0}
        fontClass={AiFont.className}
        content={messageBoxContent}
        loading={isLoading || isMutating}
      />

      <form
        hidden={!aiAlive || !playerAlive}
        onSubmit={(e) => {
          e.preventDefault();
          if (aiMood <= 0) {
            if (aiAlive && killPhrase === input.trim().toLowerCase()) {
              setAiAlive(false);
              setKillPhrase("");
              setInput("");
              setInputDisabled(true);
            }

            return;
          }
          setInputDisabled(true);
          setLastInput(input);
          setMoodDecaying(false);
          trigger(input);
          setInput("");
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

      <AiStatusBar aiMood={aiMood} aiAlive={aiAlive} playerAlive={playerAlive} killPhrase={killPhrase} />

      <GameOverBlood hidden={playerAlive} />

      <GameResult winner={ !aiAlive ? 'user' : !playerAlive ? 'assistant' : ''} />
    </div>
  );
}
