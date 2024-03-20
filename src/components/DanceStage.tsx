import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { Container, AnimatedSprite, Sprite, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";

import "../App.css";

import { GameState } from "../logic";
import ArrowIcon from "./Arrow";
import Prompt from "./Prompt";
import Score from "./Score";
import TimeBox from "./Time";

import { ROUND_1, ROUND_2 } from "../lib/rounds";

import { sound } from "../lib/sounds";

import FadingText from "./StageText";
import SwipeLine from "./Swipe";
import manifest from "../lib/manifest.json";
function DanceStage() {
  const [game, setGame] = useState<GameState>();
  const [frames, setFrames] = useState<PIXI.Texture<PIXI.Resource>[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>();

  const [playerId, setPlayerId] = useState<string>("");

  const [allPlayers, setPlayers] =
    useState<string[]>();
  const [startPoint, setStartPoint] = useState<{
    x: number;
    y: number;
  }>();
  const [endPoint, setEndPoint] = useState<{ x: number; y: number }>();
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);

  const [keyValue, setKeyValue] = useState<number>(0);

  const [bg, setBg] = useState<PIXI.Texture<PIXI.Resource>>();

  const [crowdSprite, setCrowdSprite] = useState<PIXI.Texture<PIXI.Resource>>();
  const [uiElements, setUIElements] =
    useState<Record<string, PIXI.Texture<PIXI.Resource>>>();

  const [stageLight, setStageLight] = useState<PIXI.Texture<PIXI.Resource>[]>(
    []
  );

  const [songNumber, setSongNumber] = useState<number>();

  const containerRef = useRef(null);

  const round = game?.subtractBy[playerId];

  const animatedSpriteRef: Ref<PIXI.AnimatedSprite> = useRef(null);
  const stageLightRef: Ref<PIXI.AnimatedSprite> = useRef(null);

  useEffect(() => {
    async function load() {
      async function init() {
        await PIXI.Assets.init({ manifest });
      }
      init();
      try {
        PIXI.Assets.backgroundLoadBundle([
          "background",
          "character",
          "ui_elements",
          "loading",
        ]);
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadGame() {
      try {
        const background = await PIXI.Assets.loadBundle("background");
        setBg(background.stage);
        setCrowdSprite(background.crowd);

        const UI = await PIXI.Assets.loadBundle("ui_elements");
        setUIElements(UI);

        const stageFrame = await new PIXI.Spritesheet(
          PIXI.BaseTexture.from(background.spotlight.data.meta.image),
          background.spotlight.data
        );
        await stageFrame.parse();
        setStageLight(stageFrame.animations["stage"]);

        for (const i in sound) {
          sound[i as keyof typeof sound].load();
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadGame();
  }, []);
  const handleArrowClick = useCallback(
    ({ direction }: { direction: string }) => {
      if (game?.gameOver) return;
      Rune.actions.handleClick({ direction, player: playerId });

      game?.gameOver === false && setKeyValue(Math.random() * 1e6);
    },
    [game?.gameOver, playerId]
  );

  useEffect(() => {
    function resize() {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    }

    function checkKey(e: KeyboardEvent) {
      let direction;

      switch (e.key) {
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowUp":
          direction = "up";
          break;
      }
      if (!direction) return;
      handleArrowClick({ direction });
    }

    window.addEventListener("resize", resize);
    window.focus();
    window.addEventListener("keydown", checkKey);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", checkKey);
    };
  }, [handleArrowClick]);

  useEffect(() => {
    if (game?.gameOver && songNumber) {
      sound[`song${songNumber}` as keyof typeof sound].stop();
    } else if (songNumber && game?.gameOver === false) {
      sound[`song${songNumber}` as keyof typeof sound].play();
    }
  }, [game?.gameOver, songNumber]);

  useEffect(() => {
    const num =
      Math.ceil(Math.random() * 2) === 0 ? 1 : Math.ceil(Math.random() * 2);
    setSongNumber(num);

    const getCharacter = async () => {
      const { spritesheet } = await PIXI.Assets.loadBundle("character");

      const character = await new PIXI.Spritesheet(
        PIXI.BaseTexture.from(spritesheet.data.meta.image),
        spritesheet.data
      );
      await character.parse();
      if (!game?.gameOver) {
        setFrames(character.animations.dance);
      } else {
        setFrames(character.animations.fail);
      }
    };
    getCharacter();
  }, [game?.gameOver]);
  useEffect(() => {
    let i = -1;
    Rune.initClient({
      onChange: ({ game, yourPlayerId, action, allPlayerIds }) => {
        setGame(game);
        if (yourPlayerId) {
          setPlayerId(yourPlayerId);

          setTimeLeft(game?.time[yourPlayerId]);
        }
        i += 1;
        i = i % allPlayerIds.length;
        if (yourPlayerId === undefined) {
          setPlayerId(allPlayerIds[i]);
        }
        setPlayers(allPlayerIds);
        if (
          action?.action === "handleClick" &&
          game.fail === false &&
          yourPlayerId
        ) {
          sound.cheer.play();
        } else if (action?.action === "handleClick" && game.fail == true) {
          sound.cheer.stop();
          sound.gasp.play();
        }

        if (game?.gameOver) {
          sound.gasp.play();
        }
      },
    });
  }, []);

  const totalIcons = 4; // Total number of icons
  const iconWidth = 48; // Width of each icon
  const spacing = (innerWidth - totalIcons * iconWidth) / (totalIcons + 1) + 10;

  function handleTouchStart(event: PIXI.FederatedPointerEvent) {
    if (game?.gameOver) return;

    setStartPoint({ x: event.clientX, y: event.clientY });
    setIsSwiping(true);
  }
  function handleTouchMove(event: PIXI.FederatedPointerEvent) {
    if (game?.gameOver) return;
    if (isSwiping) {
      setEndPoint({ x: event.clientX, y: event.clientY });
    }
  }
  function handleTouchEnd(event: PIXI.FederatedPointerEvent) {
    if (game?.gameOver) return;

    setIsSwiping(false);

    setEndPoint({ x: event.clientX, y: event.clientY });
    if (endPoint && startPoint) {
      let direction = "";
      const swipeDistanceX = endPoint.x - startPoint.x;
      const swipeDistanceY = endPoint.y - startPoint.y;

      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        direction = swipeDistanceX > 0 ? "right" : "left";
      } else {
        direction = swipeDistanceY > 0 ? "down" : "up";
      }

      handleArrowClick({ direction });
      setEndPoint(undefined);
      setStartPoint(undefined);
    }
  }
  function handleTouchEndOutside() {
    return;
  }

  return (
    <div>
      <Stage
        options={{
          background: 0xeef1f5,
          autoDensity: true,
        }}
        width={innerWidth}
        height={innerHeight}
      >
        <Container
          ref={containerRef}
          onpointerdown={handleTouchStart}
          onpointermove={handleTouchMove}
          onpointerupoutside={handleTouchEndOutside}
          onpointerup={handleTouchEnd}
          eventMode="static"
        >
          {bg && (
            <Sprite
              texture={bg}
              anchor={0.5}
              position={[innerWidth / 2, innerHeight / 2]}
            />
          )}

          {stageLight.length > 0 && (
            <AnimatedSprite
              isPlaying={true}
              textures={stageLight}
              animationSpeed={0.1}
              position={[innerWidth / 2, 100]}
              ref={stageLightRef}
              anchor={0.5}
              onFrameChange={() => stageLightRef.current?.play()}
            />
          )}

          {/* Prompt */}
          <Container position={[0, 0]}>
            {game?.prompts[playerId] && uiElements && (
              <Prompt
                direction={game?.prompts[playerId]}
                x={innerWidth / 2}
                y={60}
                roundNumber={round || ROUND_1}
                uiElements={uiElements}
                key={keyValue}
                freeRound={game?.freeRound[playerId]}
                playerId={playerId}
              />
            )}

            {/* DanceStage animation */}
            {frames.length > 0 && (
              <AnimatedSprite
                isPlaying={true}
                textures={frames}
                animationSpeed={
                  game?.subtractBy[playerId] &&
                    game?.subtractBy[playerId] < ROUND_2 &&
                    !game.gameOver
                    ? 0.2
                    : 0.15
                }
                position={[innerWidth / 2, innerHeight / 2]}
                scale={0.7}
                loop={true}
                anchor={0.5}
                ref={animatedSpriteRef}
                onFrameChange={() => animatedSpriteRef.current?.play()}
              />
            )}

            {/* UI elements */}

            {game?.screenWords[playerId] && (
              <FadingText
                x={innerWidth / 2}
                y={115}
                text={game?.screenWords[playerId]}
              />
            )}

            {game?.scores && (
              <Score
                scores={game?.scores}
                playerId={playerId}
                avatar={playerId && Rune.getPlayerInfo(playerId).avatarUrl}
              />
            )}
            {timeLeft && uiElements && (
              <TimeBox
                timeLeft={timeLeft}
                innerWidth={innerWidth}
                uiElements={uiElements}
              />
            )}
          </Container>
        </Container>
        {/* Arrow icons */}
        <Container>
          <SwipeLine start={startPoint} end={endPoint} isSwiping={isSwiping} />
          {crowdSprite && (
            <Sprite
              texture={crowdSprite}
              anchor={0.5}
              scale={0.8}
              x={innerWidth / 2}
              y={innerHeight + 30}
            />
          )}
          <>
            {uiElements && (
              <>
                <ArrowIcon
                  handleClick={handleArrowClick}
                  direction="up"
                  y={innerHeight - 100}
                  x={spacing}
                  playerId={playerId}
                  uiElements={uiElements}
                />
                <ArrowIcon
                  handleClick={handleArrowClick}
                  direction="left"
                  y={innerHeight - 100}
                  x={spacing + 1 * (iconWidth + spacing)}
                  playerId={playerId}
                  uiElements={uiElements}
                />
                <ArrowIcon
                  handleClick={handleArrowClick}
                  direction="right"
                  y={innerHeight - 100}
                  x={spacing + 2 * (iconWidth + spacing)}
                  playerId={playerId}
                  uiElements={uiElements}
                />
                <ArrowIcon
                  handleClick={handleArrowClick}
                  direction="down"
                  y={innerHeight - 100}
                  x={spacing + 3 * (iconWidth + spacing)}
                  playerId={playerId}
                  uiElements={uiElements}
                />
              </>
            )}
          </>
        </Container>
      </Stage>
    </div>
  );
}
export default DanceStage;
