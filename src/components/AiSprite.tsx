export default function AiSprite({
  mood,
}: {
  mood: number; // 0.0 - 1.0
}) {
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
      className="fixed self-center"
      src={`ai-${expression}.svg`}
      alt={`ai-${expression}.svg`}
    />
  );
}
