import type { RuneClient } from "rune-games-sdk/multiplayer";
import { setRandomPrompt } from "./lib/prompts";
import { ROUND_1, ROUND_2, ROUND_3, ROUND_4 } from "./lib/rounds";

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
  gameStarted: boolean;
  freeRound: Record<string, boolean>;
  screenWords: Record<string, string>;
}

type GameActions = {
  handleClick: (params: { direction: string; player: string }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

function randomSentence(): string {
  const list = [
    "Good Job",
    "Great Work",
    "Triple Threat!!!",
    "You Got This",
    "Look at you Go!",
    "On a Roll",
  ];
  return list[Math.floor(Math.random() * list.length)];
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  setup: (playerIds: string[]): GameState => {
    const scores: Record<string, number> = {};
    const prompts: Record<string, string> = {};
    const time: Record<string, number> = {};
    const roundStartAt: Record<string, number> = {};
    const subtractBy: Record<string, number> = {};
    const freeRound: Record<string, boolean> = {};
    const screenWords: Record<string, string> = {};

    for (const players of playerIds) {
      scores[players] = 0;
      prompts[players] = setRandomPrompt();
      time[players] = ROUND_1;
      roundStartAt[players] = Rune.gameTimeInSeconds();
      subtractBy[players] = ROUND_1;
      freeRound[players] = true;
      screenWords[players] = "";
    }

    return {
      session: Math.round(Math.random() * 1e9),
      scores,
      roundStartAt,
      animation: "idle",
      gameOver: false,
      subtractBy,
      playerIds,
      songNumber:
        Math.ceil(Math.random() * 2) === 0 ? 1 : Math.ceil(Math.random() * 2),
      fail: false,
      prompts,
      time,
      gameStarted: false,
      freeRound,
      screenWords,
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
        game.screenWords[player] = randomSentence();
        if (game.scores[player] > 30) game.freeRound[player] = false;
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
    for (const i in allPlayerIds) {
      if (game.freeRound[allPlayerIds[i]]) return;
      else {
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
          game.gameOver = false;
          switch (true) {
            case game.scores[allPlayerIds[i]] > 170:
              game.subtractBy[allPlayerIds[i]] = ROUND_4;
              break;
            case game.scores[allPlayerIds[i]] > 120:
              game.subtractBy[allPlayerIds[i]] = ROUND_3;
              break;
            case game.scores[allPlayerIds[i]] > 70:
              game.subtractBy[allPlayerIds[i]] = ROUND_2;
              break;
            default:
              game.subtractBy[allPlayerIds[i]] = ROUND_1;
          }

          game.time[allPlayerIds[i]] = Number(
            game.subtractBy[allPlayerIds[i]] -
            (Rune.gameTimeInSeconds() - game.roundStartAt[allPlayerIds[i]])
          );
        }
      }
    }
  },
  events: {
    playerJoined: (_, { game, allPlayerIds }) => {
      // Handle player joined
      if (game.gameOver) return;

      for (const i in allPlayerIds) {
        game.scores[allPlayerIds[i]] = 0;
        game.time[allPlayerIds[i]] = ROUND_1;
        game.roundStartAt[allPlayerIds[i]] = Rune.gameTimeInSeconds();
        game.prompts[allPlayerIds[i]] = setRandomPrompt();
        game.freeRound[allPlayerIds[i]] = true;
        game.subtractBy[allPlayerIds[i]] = ROUND_1;
      }
    },

    playerLeft(playerId, { game }) {
      // Handle player left

      if (playerId in game.scores) {
        delete game.scores[playerId];
      }
    },
  },
});
