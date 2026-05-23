interface MichiSpriteProps {
  emoji: string;
  isRunning: boolean;
  level: 1 | 2 | 3;
}

export function MichiSprite({ emoji, isRunning, level }: MichiSpriteProps) {
  let filter = "none";
  if (level === 1) {
    filter = "brightness(0.6) grayscale(0.3)";
  } else if (level === 3) {
    filter = "drop-shadow(0 0 8px #fde047)";
  }

  return (
    <div style={{ position: "relative", display: "inline-block", textAlign: "center" }}>
      <div
        className={isRunning ? "michi-run" : undefined}
        style={{ fontSize: 64, filter, lineHeight: 1 }}
      >
        {emoji}
      </div>
      <div
        style={{
          width: 80,
          height: 8,
          background: "#4ade80",
          border: "2px solid #000",
          margin: "4px auto 0",
        }}
      />
    </div>
  );
}
