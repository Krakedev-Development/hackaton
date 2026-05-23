import { MODE_CONFIG } from "../constants/runner";
import type { GameMode, GameType } from "../types/game";
import { StarField } from "./StarField";

interface GameTypeSelectScreenProps {
  mode: GameMode;
  onSelect: (type: GameType) => void;
}

export function GameTypeSelectScreen({ mode, onSelect }: GameTypeSelectScreenProps) {
  const modeEmoji = MODE_CONFIG[mode].emoji;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflow: "hidden",
      }}
    >
      <StarField />
      <div className="px-card" style={{ zIndex: 1, maxWidth: 640, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{modeEmoji}</div>
        <h2 style={{ color: "#f1f5f9", fontSize: 12, margin: "0 0 24px" }}>
          ¿CÓMO QUIERES JUGAR?
        </h2>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            className="px-card"
            style={{
              flex: "1 1 240px",
              maxWidth: 280,
              cursor: "pointer",
              boxShadow: "6px 6px 0 #fde047",
            }}
            onClick={() => onSelect("single")}
            onKeyDown={(e) => e.key === "Enter" && onSelect("single")}
            role="button"
            tabIndex={0}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐱</div>
            <p style={{ color: "#fde047", fontSize: 10, margin: "0 0 8px" }}>YO SOLO</p>
            <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 4px" }}>Practica a tu ritmo</p>
            <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 16px" }}>Sin rival</p>
            <button type="button" className="px-btn" onClick={() => onSelect("single")}>
              ▶ JUGAR SOLO
            </button>
          </div>

          <div
            className="px-card"
            style={{
              flex: "1 1 240px",
              maxWidth: 280,
              cursor: "pointer",
              boxShadow: "6px 6px 0 #60a5fa",
            }}
            onClick={() => onSelect("multi")}
            onKeyDown={(e) => e.key === "Enter" && onSelect("multi")}
            role="button"
            tabIndex={0}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🐱🐱</div>
            <p style={{ color: "#60a5fa", fontSize: 10, margin: "0 0 8px" }}>VS AMIGO</p>
            <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 4px" }}>Compite en tiempo real</p>
            <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 16px" }}>Dispositivos separados</p>
            <button type="button" className="px-btn px-btn-blue" onClick={() => onSelect("multi")}>
              ⚔ VERSUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
