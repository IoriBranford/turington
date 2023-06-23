import { useEffect, useState } from "react";

const BloodFiles = Array(7)
  .fill(0)
  .map((_, i) => `bloodsplats_000${i + 1}.png`);

export default function GameOverBlood({ hidden = false }) {
  const [positions, setPositions] = useState(Array(28).fill([0,0]))
  useEffect(()=>{
    setPositions(positions.map(()=> [
      Math.random() * (window.innerWidth - 128),
      Math.random() * (window.innerHeight - 128)
    ]))
  }, [])

  return (
    <>
      {positions.map((position, i) => {
          const file = BloodFiles[i % BloodFiles.length];
          return (
            <img
              hidden={hidden}
              key={i}
              src={file}
              alt={file}
              draggable={false}
              style={{
                position: "fixed",
                left: `${position[0]}px`,
                top: `${position[1]}px`,
              }}
            />
          );
        })}
        <article hidden={hidden} className="fixed prose w-full max-w-xl text-center"><h1>GAME OVER</h1></article>
    </>
  );
}
