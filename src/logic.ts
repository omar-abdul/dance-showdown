import type { RuneClient } from "rune-games-sdk/multiplayer";
import { setRandomPrompt } from "./lib/prompts";
import { ROUND_1, ROUND_2, ROUND_3 } from "./lib/rounds";

export interface GameState {
  scores: Record<string, number>;
  session: number;

  roundStartAt: Record<string, number>;
  animation: "idle" | "dance" | "fail";
  gameOver: boolean;

  playerIds: string[];
  fail: boolean;
  songNumber: number;
  prompts: Record<string, string>;
  time: Record<string, number>;
  subtractBy: Record<string, number>;
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
    const subtractBy: Record<string, number> = {};
    for (const players of playerIds) {
      scores[players] = 0;
      prompts[players] = setRandomPrompt();
      time[players] = ROUND_1;
      roundStartAt[players] = Rune.gameTimeInSeconds();
      subtractBy[players] = ROUND_1;
    }

    return {
      session: Math.round(Math.random() * 1e9),
      scores,
      roundStartAt,
      animation: "idle",
      gameOver: false,
      subtractBy,
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
        game.time[player] = game.subtractBy[player];
        game.fail = false;
        game.gameOver = false;
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
        game.subtractBy[allPlayerIds[i]] -
          (Rune.gameTimeInSeconds() - game.roundStartAt[allPlayerIds[i]]) <=
        0
      ) {
        game.gameOver = true;
        Rune.gameOver({
          players: game.scores,
        });
      } else {
        switch (true) {
          case game.scores[allPlayerIds[i]] > 120:
            game.subtractBy[allPlayerIds[i]] = ROUND_3;
            break;
          case game.scores[allPlayerIds[i]] > 70:
            game.subtractBy[allPlayerIds[i]] = ROUND_2;
            break;
          default:
            game.subtractBy[allPlayerIds[i]] = ROUND_1;
        }

        game.time[allPlayerIds[i]] =
          game.subtractBy[allPlayerIds[i]] -
          (Rune.gameTimeInSeconds() - game.roundStartAt[allPlayerIds[i]]);
      }
    }
  },
  events: {
    playerJoined: (playerId, { game }) => {
      // Handle player joined
      if (game.gameOver) return;
      if (playerId) game.playerIds.push(playerId);
      for (let i = 0; i < game.playerIds.length; i++) {
        game.scores[game.playerIds[i]] = 0;
        game.time[game.playerIds[i]] = ROUND_1;
        game.roundStartAt[game.playerIds[i]] = Rune.gameTimeInSeconds();
        game.prompts[game.playerIds[i]] = setRandomPrompt();
      }
    },
    playerLeft(playerId, { game }) {
      // Handle player left
      // const idx = game.playerIds.indexOf(playerId);
      // game.playerIds.splice(idx, 1);

      // for (let i = 0; i < game.playerIds.length; i++) {
      //   game.scores[game.playerIds[i]] = 0;
      //   game.time[game.playerIds[i]] = ROUND_1;
      //   game.roundStartAt[game.playerIds[i]] = Rune.gameTimeInSeconds();
      //   game.prompts[game.playerIds[i]] = setRandomPrompt();
      // }
      if (playerId in game.scores) {
        delete game.scores[playerId];
      }
    },
  },
});
