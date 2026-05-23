export type GameMode = "primaria" | "secundaria";
export type GameType = "single" | "multi";

export type GamePhase =
  | "intro"
  | "mode_select"
  | "game_type_select"
  | "lobby"
  | "waiting"
  | "running"
  | "decision"
  | "end";

export interface Choice {
  id: string;
  label: string;
  emoji: string;
  delta: number;
  happinessDelta: number;
  isGood: boolean;
}

export interface Dilemma {
  id: number;
  question: string;
  left: Choice;
  right: Choice;
}

export interface PlayerState {
  id: string;
  room_id: string;
  player_name: string;
  balance: number;
  happiness: number;
  choices: string[];
  is_ready: boolean;
  finished_at: string | null;
}

export interface RoomState {
  id: string;
  code: string;
  mode: GameMode;
  status: "waiting" | "playing" | "finished";
  created_at: string;
}

export interface RunnerState {
  phase: GamePhase;
  mode: GameMode | null;
  gameType: GameType | null;
  roomId: string | null;
  roomCode: string;
  playerName: string;
  waitingForRival: boolean;
  balance: number;
  happiness: number;
  bgOffset: number;
  currentDilemma: Dilemma | null;
  dilemmaIndex: number;
  choicesMade: Choice[];
  rival: PlayerState | null;
  michiLevel: 1 | 2 | 3;
}
