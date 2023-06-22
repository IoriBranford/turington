export default function AiMoodBar({ mood = 1 }) {
  let color = "greenyellow",
    label = "STABLE";
  if (mood < 0.2) {
    color = "salmon";
    label = "DANGER";
  } else if (mood < 0.4) {
    color = "coral";
    label = "WARNING";
  } else if (mood < 0.6) {
    color = "gold";
    label = "CAUTION";
  }
  const width = `${(mood * 100)}%`;
  return <div style={{
    width: width,
    height: '100%',
    backgroundColor: color,
    borderRadius: '0.25rem'
  }}>{label}</div>;
}
