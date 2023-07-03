export default function GameResult({winner = ''}) {
  return (
    <article
      hidden={winner === ''}
      className="fixed prose w-full max-w-xl text-center"
    >
      <h1>{winner === 'user' ? "YOU WIN!" : winner === 'assistant' ? "GAME OVER" : ""}</h1>
      <form className="text-center" action={"/play"}>
        {/* <h2 className="text-center">Options</h2>
    <input type="checkbox" id="moodDecays" name="moodDecays" value="true"/>
    <label htmlFor="moodDecays"> Time limit</label>
    <br/>
    <br/> */}
        <button
          className=" bg-white bg-opacity-80 w-full text-4xl p-4 col-span-2 border rounded shadow"
          type="submit"
        >
          <b>PLAY AGAIN</b>
        </button>
      </form>
    </article>
  );
}
