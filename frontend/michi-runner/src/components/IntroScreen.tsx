import { StarField } from "./StarField";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <StarField />
      <div className="px-card" style={{ textAlign: "center", maxWidth: 360, zIndex: 1 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🐱</div>
        <h1 style={{ color: "#fde047", fontSize: 16, margin: "0 0 8px" }}>MICHIMONEY</h1>
        <p style={{ color: "#94a3b8", fontSize: 10, margin: "0 0 16px" }}>RUNNER</p>
        <div style={{ height: 4, background: "#fde047", margin: "0 0 16px" }} />
        <p style={{ color: "#f1f5f9", fontSize: 8, margin: "0 0 24px" }}>
          ¡Aprende finanzas corriendo!
        </p>
        <button type="button" className="px-btn" onClick={onStart}>
          ▶ JUGAR
        </button>
      </div>
    </div>
  );
}
