import type { GameMode } from "../types/game";

interface ScrollingBackgroundProps {
  offset: number;
  isPaused: boolean;
  mode: GameMode;
}

const NIGHT_STARS: ReadonlyArray<{ top: number; left: number }> = [
  { top: 12, left: 20 },
  { top: 28, left: 55 },
  { top: 8, left: 80 },
  { top: 40, left: 15 },
  { top: 18, left: 120 },
  { top: 50, left: 200 },
  { top: 22, left: 280 },
  { top: 35, left: 340 },
  { top: 10, left: 400 },
  { top: 45, left: 450 },
  { top: 15, left: 520 },
  { top: 38, left: 600 },
  { top: 25, left: 680 },
  { top: 48, left: 720 },
  { top: 12, left: 760 },
];

function DayScene() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#87CEEB" }}>
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 32,
          width: 40,
          height: 40,
          background: "#fde047",
          border: "3px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 60,
          width: 48,
          height: 20,
          background: "#fff",
          border: "3px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 200,
          width: 64,
          height: 24,
          background: "#fff",
          border: "3px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 320,
          width: 40,
          height: 16,
          background: "#fff",
          border: "3px solid #000",
        }}
      />
      <div style={{ position: "absolute", bottom: 100, left: 140 }}>
        <div style={{ width: 16, height: 40, background: "#78350f", border: "2px solid #000", margin: "0 auto" }} />
        <div
          style={{
            width: 48,
            height: 48,
            background: "#4ade80",
            border: "3px solid #000",
            marginTop: -8,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          height: 40,
          background: "#4ade80",
          borderTop: "4px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "#92400e",
          borderTop: "4px solid #000",
        }}
      />
    </div>
  );
}

function NightScene() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#0f0f1a" }}>
      {NIGHT_STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: 2,
            height: 2,
            background: "#fff",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 48,
          width: 32,
          height: 32,
          background: "#f1f5f9",
          border: "4px solid #000",
          borderRadius: 0,
        }}
      />
      {[120, 200, 80, 160].map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 40,
            left: 40 + i * 110,
            width: 90,
            height: h,
            background: "#1a1a2e",
            borderLeft: "4px solid #000",
            borderRight: "4px solid #000",
            borderTop: "4px solid #000",
            display: "grid",
            gridTemplateColumns: "repeat(3, 8px)",
            gap: 8,
            padding: 8,
            alignContent: "start",
          }}
        >
          {Array.from({ length: 6 }).map((_, w) => (
            <div key={w} style={{ width: 8, height: 8, background: "#fde047" }} />
          ))}
        </div>
      ))}
      <div
        style={{ position: "absolute", bottom: 52, left: 300, width: 6, height: 6, background: "#f87171" }}
      />
      <div
        style={{ position: "absolute", bottom: 70, left: 450, width: 6, height: 6, background: "#60a5fa" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background: "#374151",
          borderTop: "4px solid #000",
        }}
      />
    </div>
  );
}

function Scene({ mode }: { mode: GameMode }) {
  return mode === "primaria" ? <DayScene /> : <NightScene />;
}

export function ScrollingBackground({ offset, mode }: ScrollingBackgroundProps) {
  const x = -(offset % 800);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          width: "200%",
          height: "100%",
          transform: `translateX(${x}px)`,
          transition: "none",
        }}
      >
        <div style={{ width: "50%", height: "100%", flexShrink: 0 }}>
          <Scene mode={mode} />
        </div>
        <div style={{ width: "50%", height: "100%", flexShrink: 0 }}>
          <Scene mode={mode} />
        </div>
      </div>
    </div>
  );
}
