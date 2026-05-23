import type { Choice, Dilemma, GameMode } from "../types/game";

interface DilemmaModalProps {
  dilemma: Dilemma;
  onChoice: (c: Choice) => void;
  mode: GameMode;
}

export function DilemmaModal({ dilemma, onChoice, mode }: DilemmaModalProps) {
  const questionSize = mode === "primaria" ? 10 : 8;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div className="px-card modal-in" style={{ maxWidth: 400, width: "90%" }}>
        <p style={{ color: "#fde047", fontSize: 10, margin: "0 0 16px" }}>⚡ DECISIÓN</p>
        <p style={{ color: "#f1f5f9", fontSize: questionSize, margin: "0 0 20px", lineHeight: 1.6 }}>
          {dilemma.question}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            className="px-btn"
            style={{ background: "#4ade80", flex: 1, padding: "12px 8px" }}
            onClick={() => onChoice(dilemma.left)}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{dilemma.left.emoji}</div>
            <div style={{ fontSize: 8, lineHeight: 1.5 }}>{dilemma.left.label}</div>
            <div style={{ fontSize: 7, color: "#065f46", marginTop: 8 }}>
              {dilemma.left.delta >= 0 ? "+" : ""}
              {dilemma.left.delta}
            </div>
          </button>
          <button
            type="button"
            className="px-btn px-btn-red"
            style={{ flex: 1, padding: "12px 8px" }}
            onClick={() => onChoice(dilemma.right)}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{dilemma.right.emoji}</div>
            <div style={{ fontSize: 8, lineHeight: 1.5 }}>{dilemma.right.label}</div>
            <div style={{ fontSize: 7, color: "#7f1d1d", marginTop: 8 }}>
              {dilemma.right.delta >= 0 ? "+" : ""}
              {dilemma.right.delta}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
