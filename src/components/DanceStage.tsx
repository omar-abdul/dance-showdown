import { useEffect, useRef, useState } from "react";
import { Container, Graphics, AnimatedSprite, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";

import "../App.css";
import { GameState } from "../logic";
import ArrowIcon from "./Arrow";
import Prompt from "./Prompt";
import { sound } from "../lib/sounds";
import Score from "./Score";
import TimeBox from "./Time";

function DanceStage() {
  const [game, setGame] = useState<GameState>();
  const [frames, setFrames] = useState<PIXI.Texture<PIXI.Resource>[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);
  const [backgroundDotColors, setBackgroundDotColors] = useState<number[]>([]);
  const [playing, setIsPlaying] = useState<boolean>(true);
  const [playerId, setPlayerId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [allPlayers, setPlayers] =
    useState<
      Record<
        string,
        { playerId: string; displayName: string; avatarUrl: string }
      >
    >();

  const containerRef = useRef(null);

  const { gameOver } = game ?? { gameOver: false };
  const currentPrompt = game?.prompts[playerId];

  useEffect(() => {
    sound.cheer.duration(1 / 4);
    sound.gasp.duration(1 / 2);

    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, action, players }) => {
        setGame(newGame);
        setPlayerId(yourPlayerId || "");

        setTimeLeft(newGame?.time[yourPlayerId || ""]);

        setPlayers(players);
        if (action?.action === "handleClick" && newGame.fail === false) {
          sound.cheer.play();
        } else if (action?.action === "handleClick" && newGame.fail == true) {
          sound.cheer.stop();
          sound.gasp.play();
        }
        setPrompt(newGame.prompts[yourPlayerId || ""]);
        if (newGame.gameOver) sound.gasp.play();
      },
    });
  }, []);

  useEffect(() => {
    setPrompt("question");

    currentPrompt &&
      setTimeout(() => {
        setPrompt(currentPrompt);
      }, 200);
    game?.songNumber &&
      sound[`song${game.songNumber}` as keyof typeof sound].play();
    if (gameOver && game?.songNumber) {
      sound[`song${game?.songNumber}` as keyof typeof sound].stop();
    }

    setIsPlaying(false);
    const danceFrames: PIXI.Texture<PIXI.Resource>[] = [];
    const failFrames: PIXI.Texture<PIXI.Resource>[] = [];
    PIXI.Assets.load("/spritesheet.json").then(() => {
      for (let i = 2; i < 14; i++) {
        danceFrames.push(PIXI.Texture.from(`dance_${i}.png`));
      }

      for (let i = 1; i < 5; i++) {
        failFrames.push(PIXI.Texture.from(`fail_${i}.png`));
      }
      if (!gameOver) {
        setFrames(danceFrames);
        setIsPlaying(true);
      } else {
        setFrames(failFrames);
        setIsPlaying(true);
      }
    });
    function resize() {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    }
    function getRandomColor() {
      const colors = ["red", "blue", "yellow", "purple"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      let colorValue;
      switch (randomColor) {
        case "red":
          colorValue = 0xff0000; // Red
          break;

        case "blue":
          colorValue = 0x0000ff; // Blue
          break;
        case "yellow":
          colorValue = 0xffff00; // Yellow
          break;
        case "purple":
          colorValue = 0xff00ff; // Purple
          break;
        default:
          colorValue = 0xffffff; // White (fallback value)
          break;
      }

      return colorValue;
    }
    function updateBackgroundDotColors() {
      const newColors = Array.from({ length: 40 }, () => getRandomColor());

      setBackgroundDotColors(newColors);
    }

    const interval = setInterval(updateBackgroundDotColors, 500);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, [gameOver, game?.songNumber, currentPrompt]);

  const totalIcons = 4; // Total number of icons
  const iconWidth = 48; // Width of each icon
  const spacing = (innerWidth - totalIcons * iconWidth) / (totalIcons + 1) + 10;

  return (
    <Container ref={containerRef}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x000000);
          g.drawRect(0, 0, innerWidth, innerHeight / 2);
          g.endFill();

          for (let i = 0; i < 40; i++) {
            const x = Math.random() * innerWidth;
            const y = (Math.random() * innerHeight) / 2 - 30;
            const dotColor = backgroundDotColors[i];
            g.beginFill(dotColor);

            g.drawCircle(x, y, 5); // Draw a circle to represent a person
            g.endFill();
          }
        }}
      />

      {/* DanceStage animation */}
      {frames.length > 0 && (
        <AnimatedSprite
          isPlaying={playing}
          textures={frames}
          animationSpeed={0.15}
          position={[innerWidth / 2, innerHeight / 2 - 65]}
          scale={0.7}
          loop={true}
        />
      )}
      <Sprite
        image={"/crowd.png"}
        anchor={0.5}
        x={innerWidth}
        y={innerHeight / 2 + 40}
      />

      {/* UI elements */}
      {/* Prompt */}
      {game?.prompts[playerId] && (
        <Prompt direction={prompt} x={innerWidth / 2} y={40} />
      )}

      {game?.scores && (
        <Score
          scores={game?.scores}
          playerId={playerId}
          avatar={
            (allPlayers &&
              allPlayers[playerId as keyof typeof allPlayers].avatarUrl) ||
            ""
          }
        />
      )}

      <TimeBox timeLeft={timeLeft} />
      {/* Arrow icons */}

      <ArrowIcon
        direction="up"
        y={innerHeight - 70}
        x={spacing}
        playerId={playerId}
      />
      <ArrowIcon
        direction="left"
        y={innerHeight - 70}
        x={spacing + iconWidth + spacing}
        playerId={playerId}
      />

      <ArrowIcon
        direction="right"
        y={innerHeight - 70}
        x={spacing + 2 * (iconWidth + spacing)}
        playerId={playerId}
      />

      <ArrowIcon
        direction="down"
        y={innerHeight - 70}
        x={spacing + 3 * (iconWidth + spacing)}
        playerId={playerId}
      />
    </Container>
  );
}
export default DanceStage;
