import { useCallback, useEffect, useRef, useState } from "react";
import {
  BG_SPEED,
  DILEMMAS,
  DILEMMA_INTERVAL_MS,
  GAME_DURATION_S,
  getMichiLevel,
  MODE_CONFIG,
} from "../constants/runner";
import type {
  Choice,
  GameMode,
  GamePhase,
  GameType,
  PlayerState,
  RunnerState,
} from "../types/game";

const INITIAL_STATE: RunnerState = {
  phase: "intro",
  mode: null,
  gameType: null,
  roomId: null,
  roomCode: "",
  playerName: "",
  balance: 0,
  happiness: 50,
  bgOffset: 0,
  currentDilemma: null,
  dilemmaIndex: 0,
  choicesMade: [],
  rival: null,
  michiLevel: 1,
  waitingForRival: false,
};

type UpdateMyStateFn = (playerId: string, patch: Partial<PlayerState>) => Promise<void>;

type FinishGameFn = (
  playerId: string,
  roomId: string,
  gameType: GameType,
  mode: GameMode,
  playerName: string,
  balance: number,
  michiLevel: 1 | 2 | 3,
  choices: string[],
) => Promise<void>;

type CreateSingleRoomFn = (
  mode: GameMode,
  playerName: string,
) => Promise<{ roomId: string; playerId: string }>;

export function useRunnerLoop(
  updateMyState: UpdateMyStateFn,
  finishGame: FinishGameFn,
  createSingleRoom: CreateSingleRoomFn,
  playerId: string | null,
  onPlayerIdChange: (id: string) => void,
) {
  const [state, setState] = useState<RunnerState>(INITIAL_STATE);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);

  const stateRef = useRef(state);
  const bgOffsetRef = useRef(0);
  const phaseRef = useRef<GamePhase>("intro");
  const dilemmaIndexRef = useRef(0);
  const balanceRef = useRef(0);
  const happinessRef = useRef(50);
  const modeRef = useRef<GameMode | null>(null);
  const gameTypeRef = useRef<GameType | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const choicesIdsRef = useRef<string[]>([]);
  const localFinishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const dilemmaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    stateRef.current = state;
    phaseRef.current = state.phase;
    modeRef.current = state.mode;
    gameTypeRef.current = state.gameType;
    roomIdRef.current = state.roomId;
    balanceRef.current = state.balance;
    happinessRef.current = state.happiness;
    dilemmaIndexRef.current = state.dilemmaIndex;
    bgOffsetRef.current = state.bgOffset;
  }, [state]);

  const clearTimers = useCallback(() => {
    if (dilemmaIntervalRef.current !== null) {
      clearInterval(dilemmaIntervalRef.current);
      dilemmaIntervalRef.current = null;
    }
    if (endTimeoutRef.current !== null) {
      clearTimeout(endTimeoutRef.current);
      endTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const goToEnd = useCallback(() => {
    phaseRef.current = "end";
    setState((prev) => ({
      ...prev,
      phase: "end",
      currentDilemma: null,
      waitingForRival: false,
    }));
  }, []);

  const tryFinishMultiEnd = useCallback(
    (rival: PlayerState | null) => {
      if (!localFinishedRef.current || gameTypeRef.current !== "multi") return;
      if (rival?.finished_at) {
        goToEnd();
      }
    },
    [goToEnd],
  );

  const showDilemma = useCallback(() => {
    const mode = modeRef.current;
    if (!mode || phaseRef.current !== "running") return;

    const idx = dilemmaIndexRef.current;
    const dilemma = DILEMMAS[mode][idx];
    if (!dilemma) {
      if (dilemmaIntervalRef.current !== null) {
        clearInterval(dilemmaIntervalRef.current);
        dilemmaIntervalRef.current = null;
      }
      return;
    }

    setState((prev) => ({
      ...prev,
      phase: "decision",
      currentDilemma: dilemma,
    }));
    phaseRef.current = "decision";
  }, []);

  const endGame = useCallback(async () => {
    clearTimers();

    const mode = modeRef.current;
    const gameType = gameTypeRef.current;
    const rid = roomIdRef.current;
    const pid = playerId;
    const playerName = stateRef.current.playerName || "JUGADOR";

    if (!mode || !gameType || !rid || !pid) {
      goToEnd();
      return;
    }

    localFinishedRef.current = true;

    try {
      await finishGame(
        pid,
        rid,
        gameType,
        mode,
        playerName,
        balanceRef.current,
        getMichiLevel(mode, balanceRef.current),
        choicesIdsRef.current,
      );
    } catch {
      /* persistencia opcional si Supabase no está configurado */
    }

    if (gameType === "single") {
      goToEnd();
      return;
    }

    const rival = stateRef.current.rival;
    if (rival?.finished_at) {
      goToEnd();
    } else {
      phaseRef.current = "running";
      setState((prev) => ({
        ...prev,
        phase: "running",
        currentDilemma: null,
        waitingForRival: true,
      }));
    }
  }, [clearTimers, finishGame, goToEnd, playerId]);

  const startRafLoop = useCallback(() => {
    const tick = () => {
      if (phaseRef.current === "running") {
        bgOffsetRef.current += BG_SPEED;
        const offset = bgOffsetRef.current % 800;
        setState((prev) => ({ ...prev, bgOffset: offset }));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    localFinishedRef.current = false;
    setTimeLeft(GAME_DURATION_S);
    phaseRef.current = "running";
    dilemmaIndexRef.current = 0;
    bgOffsetRef.current = 0;

    setState((prev) => ({
      ...prev,
      phase: "running",
      bgOffset: 0,
      dilemmaIndex: 0,
      currentDilemma: null,
      waitingForRival: false,
    }));

    startRafLoop();

    dilemmaIntervalRef.current = setInterval(() => {
      if (phaseRef.current === "running") {
        showDilemma();
      }
    }, DILEMMA_INTERVAL_MS);

    endTimeoutRef.current = setTimeout(() => {
      void endGame();
    }, GAME_DURATION_S * 1000);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
  }, [clearTimers, endGame, showDilemma, startRafLoop]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const setPhase = useCallback((phase: GamePhase) => {
    phaseRef.current = phase;
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const selectMode = useCallback((mode: GameMode) => {
    const initialBalance = MODE_CONFIG[mode].initialBalance;
    balanceRef.current = initialBalance;
    modeRef.current = mode;
    setState((prev) => ({
      ...prev,
      mode,
      balance: initialBalance,
      michiLevel: getMichiLevel(mode, initialBalance),
      phase: "game_type_select",
    }));
    phaseRef.current = "game_type_select";
  }, []);

  const selectGameType = useCallback(
    async (type: GameType) => {
      const mode = modeRef.current;
      if (!mode) return;

      gameTypeRef.current = type;
      setState((prev) => ({ ...prev, gameType: type }));

      if (type === "single") {
        const name = stateRef.current.playerName || "JUGADOR";
        try {
          const { roomId, playerId: pid } = await createSingleRoom(mode, name);
          roomIdRef.current = roomId;
          onPlayerIdChange(pid);
          setState((prev) => ({
            ...prev,
            gameType: type,
            roomId,
            playerName: name,
            phase: "running",
          }));
          phaseRef.current = "running";
          startGame();
        } catch {
          setState((prev) => ({ ...prev, gameType: null }));
          gameTypeRef.current = null;
        }
        return;
      }

      setState((prev) => ({ ...prev, gameType: type, phase: "lobby" }));
      phaseRef.current = "lobby";
    },
    [createSingleRoom, onPlayerIdChange, startGame],
  );

  const setLobbyInfo = useCallback(
    (roomCode: string, playerName: string, roomId: string, phase: GamePhase = "waiting") => {
      roomIdRef.current = roomId;
      phaseRef.current = phase;
      setState((prev) => ({ ...prev, roomCode, playerName, roomId, phase }));
    },
    [],
  );

  const makeChoice = useCallback(
    async (choice: Choice) => {
      const mode = modeRef.current;
      if (!mode) return;

      const newBalance = Math.max(0, balanceRef.current + choice.delta);
      const newHappiness = Math.min(100, Math.max(0, happinessRef.current + choice.happinessDelta));
      const newLevel = getMichiLevel(mode, newBalance);
      const newIndex = dilemmaIndexRef.current + 1;
      const newChoiceIds = [...choicesIdsRef.current, choice.id];

      balanceRef.current = newBalance;
      happinessRef.current = newHappiness;
      dilemmaIndexRef.current = newIndex;
      choicesIdsRef.current = newChoiceIds;
      phaseRef.current = "running";

      setState((prev) => ({
        ...prev,
        balance: newBalance,
        happiness: newHappiness,
        michiLevel: newLevel,
        choicesMade: [...prev.choicesMade, choice],
        dilemmaIndex: newIndex,
        phase: "running",
        currentDilemma: null,
      }));

      if (playerId) {
        await updateMyState(playerId, {
          balance: newBalance,
          happiness: newHappiness,
          choices: newChoiceIds,
        });
      }
    },
    [playerId, updateMyState],
  );

  const updateRival = useCallback(
    (playerState: PlayerState) => {
      setState((prev) => {
        const next = { ...prev, rival: playerState };
        return next;
      });
      tryFinishMultiEnd(playerState);
    },
    [tryFinishMultiEnd],
  );

  const restart = useCallback(() => {
    clearTimers();
    bgOffsetRef.current = 0;
    phaseRef.current = "intro";
    dilemmaIndexRef.current = 0;
    balanceRef.current = 0;
    happinessRef.current = 50;
    modeRef.current = null;
    gameTypeRef.current = null;
    roomIdRef.current = null;
    choicesIdsRef.current = [];
    localFinishedRef.current = false;
    setTimeLeft(GAME_DURATION_S);
    setState(INITIAL_STATE);
  }, [clearTimers]);

  return {
    state,
    timeLeft,
    setPhase,
    selectMode,
    selectGameType,
    setLobbyInfo,
    startGame,
    makeChoice,
    endGame,
    updateRival,
    restart,
    tryFinishMultiEnd,
  };
}
