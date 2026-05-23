import { useCallback, useEffect, useRef, useState } from "react";
import { DilemmaModal } from "./components/DilemmaModal";
import { EndScreen } from "./components/EndScreen";
import { GameTypeSelectScreen } from "./components/GameTypeSelectScreen";
import { HUD } from "./components/HUD";
import { IntroScreen } from "./components/IntroScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { MichiSprite } from "./components/MichiSprite";
import { ModeSelectScreen } from "./components/ModeSelectScreen";
import { ScrollingBackground } from "./components/ScrollingBackground";
import { getMichiInfo, MODE_CONFIG } from "./constants/runner";
import { useRoom } from "./hooks/useRoom";
import { useRunnerLoop } from "./hooks/useRunnerLoop";

export default function App() {
  const {
    createSingleRoom,
    createRoom,
    joinRoom,
    subscribeToRoom,
    updateMyState,
    fetchRival,
    finishGame,
  } = useRoom();

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handlePlayerIdChange = useCallback((id: string) => {
    setPlayerId(id);
  }, []);

  const {
    state,
    timeLeft,
    setPhase,
    selectMode,
    selectGameType,
    setLobbyInfo,
    startGame,
    makeChoice,
    updateRival,
    restart,
    tryFinishMultiEnd,
  } = useRunnerLoop(updateMyState, finishGame, createSingleRoom, playerId, handlePlayerIdChange);

  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  const setupSubscription = useCallback(
    (rId: string, pId: string) => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      cleanupRef.current = subscribeToRoom(rId, pId, (rival) => {
        updateRival(rival);
        if (phaseRef.current === "waiting") {
          startGame();
        }
        tryFinishMultiEnd(rival);
      });
    },
    [subscribeToRoom, updateRival, startGame, tryFinishMultiEnd],
  );

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const handleCreateRoom = useCallback(async () => {
    if (!state.mode) return;
    setLobbyError(null);
    try {
      const { roomCode, playerId: pid, roomId: rid } = await createRoom(state.mode, "JUGADOR 1");
      setPlayerId(pid);
      setLobbyInfo(roomCode, "JUGADOR 1", rid, "waiting");
      setupSubscription(rid, pid);

      const rival = await fetchRival(rid, pid);
      if (rival) {
        updateRival(rival);
        startGame();
      }
    } catch (e) {
      setLobbyError(e instanceof Error ? e.message : "Error al crear sala");
    }
  }, [
    state.mode,
    createRoom,
    setLobbyInfo,
    setupSubscription,
    fetchRival,
    updateRival,
    startGame,
  ]);

  const handleJoinRoom = useCallback(
    async (code: string, playerName: string) => {
      setLobbyError(null);
      try {
        const { roomId: rid, playerId: pid, roomCode } = await joinRoom(code, playerName);
        setPlayerId(pid);
        setLobbyInfo(roomCode, playerName, rid, "waiting");
        setupSubscription(rid, pid);

        const rival = await fetchRival(rid, pid);
        if (rival) {
          updateRival(rival);
        }
        startGame();
      } catch (e) {
        setLobbyError(e instanceof Error ? e.message : "Error al unirse");
      }
    },
    [joinRoom, setLobbyInfo, setupSubscription, fetchRival, updateRival, startGame],
  );

  const handleRestart = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setPlayerId(null);
    setLobbyError(null);
    restart();
  }, [restart]);

  const handleSelectGameType = useCallback(
    (type: Parameters<typeof selectGameType>[0]) => {
      void selectGameType(type);
    },
    [selectGameType],
  );

  const mode = state.mode;
  const gameType = state.gameType;
  const michiInfo = mode ? getMichiInfo(mode, state.michiLevel) : null;

  const inGameCanvas =
    state.phase === "running" ||
    state.phase === "decision" ||
    state.waitingForRival;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {state.phase === "intro" && (
        <IntroScreen onStart={() => setPhase("mode_select")} />
      )}

      {state.phase === "mode_select" && <ModeSelectScreen onSelect={selectMode} />}

      {state.phase === "game_type_select" && mode && (
        <GameTypeSelectScreen mode={mode} onSelect={handleSelectGameType} />
      )}

      {(state.phase === "lobby" || state.phase === "waiting") && mode && gameType === "multi" && (
        <LobbyScreen
          mode={mode}
          roomCode={state.roomCode}
          isWaiting={state.phase === "waiting"}
          error={lobbyError}
          onCreateRoom={() => void handleCreateRoom()}
          onJoinRoom={(code, name) => void handleJoinRoom(code, name)}
        />
      )}

      {inGameCanvas && mode && gameType && michiInfo && (
        <div
          style={{
            position: "relative",
            width: 480,
            height: 520,
            overflow: "hidden",
            border: "4px solid #000",
            boxShadow: "6px 6px 0 #fde047",
          }}
        >
          <ScrollingBackground
            offset={state.bgOffset}
            isPaused={state.phase === "decision" || state.waitingForRival}
            mode={mode}
          />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}>
            <HUD
              balance={state.balance}
              happiness={state.happiness}
              michiLevel={state.michiLevel}
              michiEmoji={michiInfo.emoji}
              timeLeft={timeLeft}
              rivalBalance={state.rival?.balance ?? 0}
              rivalName={state.rival?.player_name ?? "RIVAL"}
              mode={mode}
              balanceUnit={MODE_CONFIG[mode].balanceUnit}
              gameType={gameType}
            />
          </div>
          <div style={{ position: "absolute", bottom: 80, left: 60, zIndex: 2 }}>
            <MichiSprite
              emoji={michiInfo.emoji}
              isRunning={state.phase === "running" && !state.waitingForRival}
              level={state.michiLevel}
            />
          </div>
          {state.phase === "decision" && state.currentDilemma && !state.waitingForRival && (
            <DilemmaModal
              dilemma={state.currentDilemma}
              onChoice={(c) => void makeChoice(c)}
              mode={mode}
            />
          )}
          {state.waitingForRival && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                gap: 16,
              }}
            >
              <div className="spinner" />
              <p className="blink" style={{ color: "#fde047", fontSize: 10, margin: 0 }}>
                Esperando rival... 🐱
              </p>
            </div>
          )}
        </div>
      )}

      {state.phase === "end" && gameType && (
        <EndScreen
          state={state}
          rival={state.rival}
          gameType={gameType}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
