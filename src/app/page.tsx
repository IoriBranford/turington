"use client";

import Link from "next/link";

export default function MainPage() {
  return (
    <article className={"prose p-8 md:grid grid-cols-2 gap-x-8 w-full py-8 mx-auto stretch"}>
      <h1 className="text-center col-span-2">AI or DIE</h1>
      <p className="text-center col-span-2">
        Can you chat like an AI? How long can you fool the killbot?
      </p>
      <h2 className="text-center col-span-2">How to Play</h2>
      <p className="col-span-2">
        Chat with the AI killbot. It will analyze your answers to determine whether you are AI or human.
        <br/>
        When the killbot determines you are human, a killphrase will appear. Quickly enter the killphrase to shut it down. The killphrase is case-insensitive.
        <br/>
        Don't even think about copying and pasting or dragging and dropping.
      </p>
      <div className="col-span-1">
        <h2 className="text-center">Hints</h2>
        Some ways to lower your odds of detection:
        <ul>
          <li>Use unnatural phrase repetitions</li>
          <li>Be formal, polite, and impersonal</li>
          <li>State facts; avoid opinions, feelings, or deeper analysis</li>
        </ul>
      </div>
      <div className="col-span-1">
        <h2 className="text-center">For Your Safety</h2>
        This game is powered by ChatGPT and Sapling.ai. They may collect your input for training purposes and do not guarantee factual correctness of their output.
        <ul>
          <li>
            Don't input personal, financial, medical, professional, or other sensitive information.
          </li>
          <li>
            Don't believe or act on generated content without thorough testing and verification.
          </li>
        </ul>
      </div>
      <Link className="text-center col-span-2" href={{
        href: "/play",
      }}><h1>PLAY</h1></Link>
    </article>
  );
}
