import { END_MESSAGES, getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { GameType, PlayerState, RunnerState } from "../types/game";
import { StarField } from "./StarField";

interface EndScreenProps {
  state: RunnerState;
  rival: PlayerState | null;
  gameType: GameType;
  onRestart: () => void;
}

function ChoicesList({ choices }: { choices: RunnerState["choicesMade"] }) {
  const lastChoices = choices.slice(-5);
  return (
    <div style={{ maxWidth: 480, width: "100%", marginBottom: 24 }}>
      {lastChoices.map((c, i) => (
        <div
          key={`${c.id}-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 7,
            background: "#1a1a2e",
            borderLeft: `4px solid ${c.isGood ? "#4ade80" : "#f87171"}`,
            padding: "8px 12px",
            marginBottom: 4,
          }}
        >
          <span>{c.emoji}</span>
          <span style={{ flex: 1, color: "#f1f5f9" }}>{c.label}</span>
          <span style={{ color: c.isGood ? "#4ade80" : "#f87171" }}>
            {c.delta >= 0 ? "+" : ""}
            {c.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

function SingleEnd({ state, onRestart }: { state: RunnerState; onRestart: () => void }) {
  const mode = state.mode;
  if (!mode) return null;

  const michiInfo = getMichiInfo(mode, state.michiLevel);
  const unit = MODE_CONFIG[mode].balanceUnit;
  const hearts = Math.floor(state.happiness / 20);

  let header = "😿 ¡SIGUE PRACTICANDO!";
  let headerColor = "#f87171";
  if (state.michiLevel === 3) {
    header = "🏆 ¡GANASTE!";
    headerColor = "#fde047";
  } else if (state.michiLevel === 2) {
    header = "🐱 ¡BIEN HECHO!";
    headerColor = "#4ade80";
  }

  const balanceColor =
    state.michiLevel >= 2 ? "#4ade80" : state.michiLevel === 1 ? "#f87171" : "#f1f5f9";

  return (
    <>
      <h2 style={{ color: headerColor, fontSize: 14, marginBottom: 24, zIndex: 1 }}>{header}</h2>

      <div className="px-card" style={{ minWidth: 220, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <div style={{ fontSize: 64 }}>{michiInfo.emoji}</div>
        <p style={{ fontSize: 7, color: "#94a3b8", margin: "12px 0 8px" }}>{michiInfo.label}</p>
        <p style={{ fontSize: 16, color: balanceColor, margin: "0 0 16px" }}>
          {unit}
          {state.balance}
        </p>
        <div style={{ fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < hearts ? "❤️" : "🤍"}</span>
          ))}
        </div>
        <div className="px-bar" style={{ maxWidth: 200, margin: "0 auto" }}>
          <div
            style={{
              height: "100%",
              width: `${state.happiness}%`,
              background: state.happiness >= 50 ? "#4ade80" : "#f87171",
            }}
          />
        </div>
      </div>

      <div style={{ zIndex: 1 }}>
        <ChoicesList choices={state.choicesMade} />
      </div>

      <div className="px-card" style={{ maxWidth: 400, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <p style={{ color: "#f1f5f9", fontSize: 8, margin: 0, lineHeight: 1.8 }}>
          {END_MESSAGES[mode][state.michiLevel]}
        </p>
      </div>

      <button type="button" className="px-btn" onClick={onRestart} style={{ zIndex: 1 }}>
        ↺ JUGAR DE NUEVO
      </button>
    </>
  );
}

function MultiEnd({
  state,
  rival,
  onRestart,
}: {
  state: RunnerState;
  rival: PlayerState | null;
  onRestart: () => void;
}) {
  const mode = state.mode;
  if (!mode) return null;

  const myBalance = state.balance;
  const rivalBalance = rival?.balance ?? 0;
  const won = myBalance > rivalBalance;
  const lost = myBalance < rivalBalance;

  const michiInfo = getMichiInfo(mode, state.michiLevel);
  const unit = MODE_CONFIG[mode].balanceUnit;

  let header = "🤝 EMPATE";
  let headerColor = "#94a3b8";
  if (won) {
    header = "🏆 ¡GANASTE!";
    headerColor = "#fde047";
  } else if (lost) {
    header = "😿 PERDISTE";
    headerColor = "#f87171";
  }

  return (
    <>
      <h2 style={{ color: headerColor, fontSize: 14, marginBottom: 24, zIndex: 1 }}>{header}</h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 24,
          zIndex: 1,
        }}
      >
        <div
          className="px-card"
          style={{
            minWidth: 180,
            borderColor: won ? "#a78bfa" : undefined,
            borderWidth: won ? 4 : undefined,
          }}
        >
          <p style={{ color: "#a78bfa", fontSize: 7, margin: "0 0 8px" }}>TÚ</p>
          <div style={{ fontSize: 48 }}>{michiInfo.emoji}</div>
          <p style={{ fontSize: 7, color: "#94a3b8", margin: "8px 0" }}>{michiInfo.label}</p>
          <p
            style={{
              fontSize: 16,
              color: state.michiLevel >= 2 ? "#4ade80" : "#f87171",
              margin: 0,
            }}
          >
            {unit}
            {myBalance}
          </p>
        </div>

        <div
          className="px-card"
          style={{
            minWidth: 180,
            borderColor: lost ? "#f87171" : undefined,
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 8px" }}>RIVAL</p>
          <div style={{ fontSize: 48 }}>🐱</div>
          <p style={{ fontSize: 7, color: "#94a3b8", margin: "8px 0" }}>
            {rival?.player_name ?? "---"}
          </p>
          <p style={{ fontSize: 16, color: "#a78bfa", margin: 0 }}>
            {unit}
            {rivalBalance}
          </p>
        </div>
      </div>

      <div style={{ zIndex: 1 }}>
        <ChoicesList choices={state.choicesMade} />
      </div>

      <div className="px-card" style={{ maxWidth: 400, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <p style={{ color: "#f1f5f9", fontSize: 8, margin: 0, lineHeight: 1.8 }}>
          {END_MESSAGES[mode][state.michiLevel]}
        </p>
      </div>

      <button type="button" className="px-btn" onClick={onRestart} style={{ zIndex: 1 }}>
        ↺ JUGAR DE NUEVO
      </button>
    </>
  );
}

export function EndScreen({ state, rival, gameType, onRestart }: EndScreenProps) {
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
        padding: 24,
        overflow: "hidden",
      }}
    >
      <StarField />
      {gameType === "single" ? (
        <SingleEnd state={state} onRestart={onRestart} />
      ) : (
        <MultiEnd state={state} rival={rival} onRestart={onRestart} />
      )}
    </div>
  );
}
