import { useState } from "react";
import type { GameMode } from "../types/game";
import { StarField } from "./StarField";

interface LobbyScreenProps {
  mode: GameMode;
  roomCode: string;
  isWaiting: boolean;
  error: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (code: string, playerName: string) => void;
}

export function LobbyScreen({
  mode,
  roomCode,
  isWaiting,
  error,
  onCreateRoom,
  onJoinRoom,
}: LobbyScreenProps) {
  const [playerName, setPlayerName] = useState("JUGADOR 2");
  const [joinCode, setJoinCode] = useState("");

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
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
          maxWidth: 720,
        }}
      >
        <div className="px-card" style={{ flex: "1 1 280px" }}>
          <h3 style={{ color: "#fde047", fontSize: 10, margin: "0 0 16px" }}>CREAR SALA</h3>
          {!roomCode ? (
            <button type="button" className="px-btn" onClick={onCreateRoom}>
              CREAR SALA
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div className="px-code">{roomCode}</div>
              <p style={{ color: "#94a3b8", fontSize: 8, marginTop: 16 }}>
                Comparte este código
              </p>
              {isWaiting && (
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div className="spinner" />
                  <p className="blink" style={{ color: "#f1f5f9", fontSize: 8, margin: 0 }}>
                    Esperando rival... 🐱
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-card" style={{ flex: "1 1 280px" }}>
          <h3 style={{ color: "#60a5fa", fontSize: 10, margin: "0 0 16px" }}>UNIRSE A SALA</h3>
          <label style={{ color: "#f1f5f9", fontSize: 8, display: "block", marginBottom: 8 }}>
            TU NOMBRE:
          </label>
          <input
            className="px-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="JUGADOR 2"
            style={{ marginBottom: 16 }}
          />
          <label style={{ color: "#f1f5f9", fontSize: 8, display: "block", marginBottom: 8 }}>
            CÓDIGO:
          </label>
          <input
            className="px-input"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            placeholder="0000"
            style={{ marginBottom: 16 }}
          />
          <button
            type="button"
            className="px-btn px-btn-blue"
            onClick={() => onJoinRoom(joinCode, playerName)}
            disabled={joinCode.length !== 4 || !playerName.trim()}
          >
            UNIRSE
          </button>
        </div>
      </div>
      {error && (
        <p
          style={{
            position: "absolute",
            bottom: 24,
            color: "#f87171",
            fontSize: 8,
            zIndex: 2,
          }}
        >
          {error}
        </p>
      )}
      <p style={{ position: "absolute", top: 16, color: "#94a3b8", fontSize: 7, zIndex: 2 }}>
        Modo: {mode.toUpperCase()}
      </p>
    </div>
  );
}
