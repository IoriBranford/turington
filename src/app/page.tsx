"use client";

import Link from "next/link";

export default function MainPage() {
  return (
    <article className={"prose grid grid-cols-2 w-full py-8 mx-auto stretch"}>
      <h1 className="text-center col-span-2">AI or DIE</h1>
      <p className="text-center col-span-2">
        Can you chat like an AI? How long can you fool the killbot?
      </p>
      <div className="col-span-1">
        <h2>Hints</h2>
        These <i>may</i> lower your odds of detection:
        <ul>
          <li>Avoid misspellings and emojis</li>
          <li>Use unnatural changes of subject</li>
          <li>Use unnatural phrase repetitions</li>
          <li>Be formal and polite</li>
          <li>Stick to the facts</li>
        </ul>
      </div>
      <div className="col-span-1">
        <h2>For Your Safety</h2>
        <ul>
          <li>
            Don't input sensitive information
          </li>
          <li>
            Don't believe or make use of generated content without thorough
            testing and verification
          </li>
        </ul>
      </div>
      <Link className="text-center col-span-2" href="/play"><h1>PLAY</h1></Link>
    </article>
  );
}
