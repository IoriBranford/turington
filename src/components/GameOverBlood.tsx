const BloodFiles = Array(7)
  .fill(0)
  .map((_, i) => `bloodsplats_000${i + 1}.png`);

export default function GameOverBlood({ hidden = false }) {
  return (
    <>
      {Array(28)
        .fill(0)
        .map((_, i) => {
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
                left: `${Math.random() * (window.innerWidth - 128)}px`,
                top: `${Math.random() * (window.innerHeight - 128)}px`,
              }}
            />
          );
        })}
    </>
  );
}
