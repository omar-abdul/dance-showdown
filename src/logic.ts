import type { RuneClient } from "rune-games-sdk/multiplayer";
import { setRandomPrompt } from "./lib/prompts";

export interface GameState {
  scores: Record<string, number>;
  session: number;

  roundStartAt: Record<string, number>;
  animation: "idle" | "dance" | "fail";
  gameOver: boolean;
  timeLeft: number;
  playerIds: string[];
  fail: boolean;
  songNumber: number;
  prompts: Record<string, string>;
  time: Record<string, number>;
}

type GameActions = {
  handleClick: (params: { direction: string; player: string }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds: string[]): GameState => {
    const scores: Record<string, number> = {};
    const prompts: Record<string, string> = {};
    const time: Record<string, number> = {};
    const roundStartAt: Record<string, number> = {};
    for (const players of playerIds) {
      scores[players] = 0;
      prompts[players] = setRandomPrompt();
      time[players] = 10;
      roundStartAt[players] = Rune.gameTimeInSeconds();
    }

    return {
      session: Math.round(Math.random() * 1e9),
      scores,
      roundStartAt,
      animation: "idle",
      gameOver: false,
      timeLeft: 10,
      playerIds,
      songNumber: Math.ceil(Math.random() * 4),
      fail: false,
      prompts,
      time,
    };
  },
  actions: {
    handleClick: ({ direction, player }, { game, playerId }) => {
      if (direction === game.prompts[playerId]) {
        game.scores[player] = game.scores[playerId] + 10;
        game.prompts[player] = setRandomPrompt();
        game.roundStartAt[player] = Rune.gameTimeInSeconds();
        game.time[player] = 10;
        game.fail = false;
      } else {
        game.gameOver = true;
        game.fail = true;
        Rune.gameOver({
          players: game.scores,
        });
      }
    },
  },
  update: ({ game, allPlayerIds }) => {
    for (let i = 0; i < allPlayerIds.length; i++) {
      if (
        10 - (Rune.gameTimeInSeconds() - game.roundStartAt[allPlayerIds[i]]) ===
        0
      ) {
        game.gameOver = true;
        Rune.gameOver({
          players: game.scores,
        });
      } else {
        game.time[allPlayerIds[i]] =
          10 - (Rune.gameTimeInSeconds() - game.roundStartAt[allPlayerIds[i]]);
      }
    }
  },
  events: {
    playerJoined: (playerId, { game }) => {
      // Handle player joined

      game.scores[playerId] = 0;
      game.time[playerId] = 10;
      game.roundStartAt[playerId] = Rune.gameTimeInSeconds();
      game.prompts[playerId] = setRandomPrompt();
      game.playerIds.push(playerId);
    },
    playerLeft() {
      // Handle player left
    },
  },
});
