import AiMoodBar from "./AiMoodBar";

export default function AiStatusBar({aiMood = 1, aiAlive = true, playerAlive = true, killPhrase = ''}) {
    return (
      <>
        <div
          hidden={killPhrase === "" || !playerAlive}
          className="fixed bottom-24 w-full max-w-xl p-2 mb-8"
        >
          ENTER KILLPHRASE!
        </div>
        <div
          hidden={!aiAlive || !playerAlive}
          className="fixed bottom-16 w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
        >
          {aiMood > 0 ? <AiMoodBar mood={aiMood} /> : killPhrase}
        </div>
      </>
    );
  }