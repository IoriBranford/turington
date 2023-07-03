export default function AiSprite({ mood = 1, scale = 1, alive = true }) {
  const expression =
    !alive
      ? "dead"
      : mood <= 0
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
      draggable={false}
      src={`ai-${expression}.svg`}
      alt={`ai-${expression}.svg`}
    />
  );
}
