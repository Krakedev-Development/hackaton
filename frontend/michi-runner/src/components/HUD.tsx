import { getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { GameMode, GameType } from "../types/game";

interface HUDProps {
  balance: number;
  happiness: number;
  michiLevel: 1 | 2 | 3;
  michiEmoji: string;
  timeLeft: number;
  rivalBalance: number;
  rivalName: string;
  mode: GameMode;
  balanceUnit: string;
  gameType: GameType;
}

export function HUD({
  balance,
  happiness,
  michiLevel,
  michiEmoji,
  timeLeft,
  rivalBalance,
  rivalName,
  mode,
  balanceUnit,
  gameType,
}: HUDProps) {
  const initial = MODE_CONFIG[mode].initialBalance;
  const balanceColor = balance > initial ? "#4ade80" : balance < initial ? "#f87171" : "#f1f5f9";
  const barColor = balance >= initial ? "#4ade80" : "#f87171";
  const barPct = Math.min(100, Math.max(0, (balance / Math.max(initial * 2, 1)) * 100));
  const michiLabel = getMichiInfo(mode, michiLevel).label;
  const hearts = Math.floor(happiness / 20);

  return (
    <div style={{ background: "#0f0f1a", borderBottom: "4px solid #000", padding: "8px 12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 7, color: "#94a3b8", marginBottom: 4 }}>
            {michiEmoji} {michiLabel}
          </div>
          <div style={{ fontSize: 10, color: balanceColor }}>
            {balanceUnit}
            {balance}
          </div>
          <div className="px-bar" style={{ marginTop: 6 }}>
            <div style={{ height: "100%", width: `${barPct}%`, background: barColor }} />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            className={timeLeft < 10 ? "blink" : undefined}
            style={{ fontSize: 16, color: timeLeft < 10 ? "#f87171" : "#fde047" }}
          >
            {timeLeft}
          </div>
          <div style={{ fontSize: 7, color: "#94a3b8" }}>SEG</div>
        </div>

        {gameType === "single" ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>SOLO</div>
            <div style={{ fontSize: 24, textAlign: "right", margin: "4px 0" }}>🐱</div>
            <div style={{ fontSize: 7, color: "#4ade80" }}>¡Tú puedes!</div>
          </div>
        ) : (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>{rivalName || "RIVAL"}</div>
            <div style={{ fontSize: 10, color: "#a78bfa" }}>
              {balanceUnit}
              {rivalBalance}
            </div>
            <div className="blink" style={{ fontSize: 7, color: "#f87171", marginTop: 4 }}>
              EN VIVO
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: 10, marginTop: 8, letterSpacing: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < hearts ? "❤️" : "🤍"}</span>
        ))}
      </div>
    </div>
  );
}
