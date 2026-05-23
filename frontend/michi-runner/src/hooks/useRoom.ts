import { useCallback, useRef } from "react";
import { MODE_CONFIG } from "../constants/runner";
import { supabase } from "../lib/supabase";
import type { GameMode, GameType, PlayerState } from "../types/game";

interface DbPlayerRow {
  id: string;
  room_id: string;
  player_name: string;
  balance: number;
  happiness: number;
  choices: string[];
  is_ready: boolean;
  finished_at: string | null;
}

function toPlayerState(row: DbPlayerRow): PlayerState {
  return {
    id: row.id,
    room_id: row.room_id,
    player_name: row.player_name,
    balance: row.balance,
    happiness: row.happiness,
    choices: row.choices ?? [],
    is_ready: row.is_ready,
    finished_at: row.finished_at,
  };
}

function generateRoomCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function useRoom() {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const createSingleRoom = useCallback(async (mode: GameMode, playerName: string) => {
    const initialBalance = MODE_CONFIG[mode].initialBalance;

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ mode, game_type: "single", status: "playing", code: null })
      .select("id")
      .single();

    if (roomError || !room) {
      throw new Error(roomError?.message ?? "No se pudo crear la partida");
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        player_name: playerName,
        balance: initialBalance,
        happiness: 50,
        choices: [],
        is_ready: false,
      })
      .select("id")
      .single();

    if (playerError || !player) {
      throw new Error(playerError?.message ?? "No se pudo crear el jugador");
    }

    return { roomId: room.id as string, playerId: player.id as string };
  }, []);

  const createRoom = useCallback(async (mode: GameMode, playerName: string) => {
    const code = generateRoomCode();
    const initialBalance = MODE_CONFIG[mode].initialBalance;

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ code, mode, game_type: "multi", status: "waiting" })
      .select("id")
      .single();

    if (roomError || !room) {
      throw new Error(roomError?.message ?? "No se pudo crear la sala");
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        player_name: playerName,
        balance: initialBalance,
        happiness: 50,
        choices: [],
        is_ready: false,
      })
      .select("id")
      .single();

    if (playerError || !player) {
      throw new Error(playerError?.message ?? "No se pudo crear el jugador");
    }

    return { roomCode: code, playerId: player.id as string, roomId: room.id as string };
  }, []);

  const joinRoom = useCallback(async (code: string, playerName: string) => {
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, mode, status, game_type")
      .eq("code", code)
      .eq("status", "waiting")
      .eq("game_type", "multi")
      .maybeSingle();

    if (roomError || !room) {
      throw new Error("Sala no encontrada");
    }

    const mode = room.mode as GameMode;
    const initialBalance = MODE_CONFIG[mode].initialBalance;

    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        room_id: room.id,
        player_name: playerName,
        balance: initialBalance,
        happiness: 50,
        choices: [],
        is_ready: false,
      })
      .select("id")
      .single();

    if (playerError || !player) {
      throw new Error(playerError?.message ?? "No se pudo unir a la sala");
    }

    await supabase.from("rooms").update({ status: "playing" }).eq("id", room.id);

    return {
      roomId: room.id as string,
      playerId: player.id as string,
      roomCode: code,
      mode,
    };
  }, []);

  const subscribeToRoom = useCallback(
    (roomId: string, myPlayerId: string, onRivalUpdate: (p: PlayerState) => void) => {
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "players",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            const row = payload.new as DbPlayerRow;
            if (row.id !== myPlayerId) {
              onRivalUpdate(toPlayerState(row));
            }
          },
        )
        .subscribe();

      channelRef.current = channel;

      return () => {
        void supabase.removeChannel(channel);
        channelRef.current = null;
      };
    },
    [],
  );

  const fetchRival = useCallback(async (roomId: string, myPlayerId: string) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .neq("id", myPlayerId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return toPlayerState(data as DbPlayerRow);
  }, []);

  const updateMyState = useCallback(async (playerId: string, patch: Partial<PlayerState>) => {
    const { error } = await supabase.from("players").update(patch).eq("id", playerId);
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const finishGame = useCallback(
    async (
      playerId: string,
      roomId: string,
      gameType: GameType,
      mode: GameMode,
      playerName: string,
      balance: number,
      michiLevel: 1 | 2 | 3,
      choices: string[],
    ) => {
      const finishedAt = new Date().toISOString();

      const { error: playerError } = await supabase
        .from("players")
        .update({ finished_at: finishedAt })
        .eq("id", playerId);

      if (playerError) {
        throw new Error(playerError.message);
      }

      const { error: roomError } = await supabase
        .from("rooms")
        .update({ status: "finished" })
        .eq("id", roomId);

      if (roomError) {
        throw new Error(roomError.message);
      }

      const { error: rpcError } = await supabase.rpc("save_final_score", {
        p_player_name: playerName,
        p_mode: mode,
        p_game_type: gameType,
        p_final_balance: balance,
        p_michi_level: michiLevel,
        p_choices: choices,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }
    },
    [],
  );

  return {
    createSingleRoom,
    createRoom,
    joinRoom,
    subscribeToRoom,
    updateMyState,
    fetchRival,
    finishGame,
  };
}
