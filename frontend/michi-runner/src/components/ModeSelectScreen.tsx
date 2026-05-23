import { MODE_CONFIG } from "../constants/runner";
import type { GameMode } from "../types/game";
import { StarField } from "./StarField";

interface ModeSelectScreenProps {
  onSelect: (mode: GameMode) => void;
}

export function ModeSelectScreen({ onSelect }: ModeSelectScreenProps) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: 24,
      }}
    >
      <StarField />
      <h2 style={{ color: "#f1f5f9", fontSize: 12, marginBottom: 32, zIndex: 1 }}>
        ¿QUIÉN VA A JUGAR?
      </h2>
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className="px-btn"
            style={{ background: "#4ade80", minWidth: 160 }}
            onClick={() => onSelect("primaria")}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{MODE_CONFIG.primaria.emoji}</div>
            {MODE_CONFIG.primaria.label.toUpperCase()}
          </button>
          <p style={{ color: "#94a3b8", fontSize: 7, marginTop: 12 }}>{MODE_CONFIG.primaria.ages}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className="px-btn px-btn-blue"
            style={{ minWidth: 160 }}
            onClick={() => onSelect("secundaria")}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{MODE_CONFIG.secundaria.emoji}</div>
            {MODE_CONFIG.secundaria.label.toUpperCase()}
          </button>
          <p style={{ color: "#94a3b8", fontSize: 7, marginTop: 12 }}>
            {MODE_CONFIG.secundaria.ages}
          </p>
        </div>
      </div>
    </div>
  );
}
