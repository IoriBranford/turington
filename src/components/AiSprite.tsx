export default function AiSprite({ mood = 1, scale = 1 }) {
  const expression =
    mood < 0
      ? "dead"
      : mood == 0
      ? "hostile"
      : mood <= 0.2
      ? "annoyed"
      : mood <= 0.4
      ? "suspicious"
      : mood <= 0.6
      ? "neutral"
      : "friendly";

  return (
    <img
      style={{
        position: "fixed",
        alignSelf: "center",
        scale: scale
      }}
      src={`ai-${expression}.svg`}
      alt={`ai-${expression}.svg`}
    />
  );
}
