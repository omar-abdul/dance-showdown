import { Ref, useEffect, useRef, useState } from "react";
import { Container, AnimatedSprite, Sprite, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";

import "../App.css";

import { GameState } from "../logic";
import ArrowIcon from "./Arrow";
import Prompt from "./Prompt";
import Score from "./Score";
import TimeBox from "./Time";

import { ROUND_1 } from "../lib/rounds";
import { sound } from "../lib/sounds";

import FadingText from "./StageText";
import SwipeLine from "./Swipe";
import manifest from "../lib/manifest.json";
function DanceStage() {
  const [game, setGame] = useState<GameState>();
  const [frames, setFrames] = useState<PIXI.Texture<PIXI.Resource>[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>();

  const [playerId, setPlayerId] = useState<string>("");
  // const [prompt, setPrompt] = useState<string>("");
  const [allPlayers, setPlayers] =
    useState<
      Record<
        string,
        { playerId: string; displayName: string; avatarUrl: string }
      >
    >();
  const [startPoint, setStartPoint] = useState<{
    x: number;
    y: number;
  }>();
  const [endPoint, setEndPoint] = useState<{ x: number; y: number }>();
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);
  const [danceFrames, setDanceFrames] = useState<PIXI.Texture<PIXI.Resource>[]>(
    []
  );
  const [failFrames, setFailFrames] = useState<PIXI.Texture<PIXI.Resource>[]>(
    []
  );
  const [keyValue, setKeyValue] = useState<number>(0);
  const [fadingText, setFadingText] = useState<string>("");
  const [isShowing, setIsShowing] = useState<{
    playerId: string;
    isShowing: boolean;
  }>();

  const [bg, setBg] = useState<any>("");
  // const [loadingScreen, setLoadingScreen] = useState<any>();
  const [crowdSprite, setCrowdSprite] = useState<any>();
  const [uiElements, setUIElements] = useState<any>();
  // const [loadingBg, setLoadingBg] = useState<any>();
  const [stageLight, setStageLight] = useState<PIXI.Texture<PIXI.Resource>[]>(
    []
  );

  const containerRef = useRef(null);

  const loadContainerRef = useRef<PIXI.Container>(null);

  const { gameOver } = game ?? {};
  const round = game?.subtractBy[playerId];

  const animatedSpriteRef: Ref<PIXI.AnimatedSprite> = useRef(null);
  const stageLightRef: Ref<PIXI.AnimatedSprite> = useRef(null);

  useEffect(() => {
    // PIXI.Assets.load("spritesheet.json").then(() => {
    //   const frame1 = [],
    //     frame2 = [];
    //   for (let i = 2; i < 14; i++) {
    //     frame1.push(PIXI.Texture.from(`dance_${i}.png`));
    //   }

    //   for (let i = 1; i < 5; i++) {
    //     frame2.push(PIXI.Texture.from(`fail_${i}.png`));
    //   }
    //   setDanceFrames(frame1);
    //   setFailFrames(frame2);
    // });

    // async function loadScreen() {
    //   try {
    //     const loadingBg = await PIXI.Assets.loadBundle("loading");
    //     //console.log(loadingBg);
    //     setLoadingBg(loadingBg["bg-loading"]);
    //     const { load } = await PIXI.Assets.loadBundle("loading");
    //     const loadSprite = await new PIXI.Spritesheet(
    //       PIXI.BaseTexture.from(load.data.meta.image),
    //       load.data
    //     );

    //     await loadSprite.parse();
    //     // console.log(loadSprite.animations.loading);
    //     setLoadingScreen(loadSprite.animations.loading);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

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
      // loadScreen();
    }
    load();
  }, []);

  useEffect(() => {
    async function loadGame() {
      try {
        const background = await PIXI.Assets.loadBundle("background");
        setBg(background.stage);
        setCrowdSprite(background.crowd);
        const { spritesheet } = await PIXI.Assets.loadBundle("character");
        const character = await new PIXI.Spritesheet(
          PIXI.BaseTexture.from(spritesheet.data.meta.image),
          spritesheet.data
        );
        await character.parse();

        const UI = await PIXI.Assets.loadBundle("ui_elements");
        setUIElements(UI);
        setDanceFrames(character.animations.dance);
        setFailFrames(character.animations.fail);

        const stageFrame = await new PIXI.Spritesheet(
          PIXI.BaseTexture.from(background.spotlight.data.meta.image),
          background.spotlight.data
        );
        await stageFrame.parse();
        setStageLight(stageFrame.animations["spot-light"]);

        for (const i in sound) {
          sound[i as keyof typeof sound].load();
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadGame().then(async () => {
      sound.cheer.duration(1 / 4);
      sound.gasp.duration(1 / 2);
      loadScreenRemove();

      Rune.initClient({
        onChange: ({ newGame, yourPlayerId, action, players }) => {
          setGame(newGame);
          setPlayerId(yourPlayerId || "");

          setTimeLeft(newGame?.time[yourPlayerId || ""]);

          setPlayers(players);
          if (action?.action === "handleClick" && newGame.fail === false) {
            sound.cheer.play();

            const list = [
              "Good Job",
              "Great Work",
              "Triple Threat!!!",
              "You Got This",
              "Look at you Go!",
              "On a Roll",
            ];
            const text = list[Math.floor(Math.random() * list.length)];
            setIsShowing({ playerId: yourPlayerId || "", isShowing: true });

            setFadingText(() => text);
            setTimeout(() => {
              setIsShowing({ playerId: yourPlayerId || "", isShowing: false });
            }, 500);
          } else if (action?.action === "handleClick" && newGame.fail == true) {
            sound.cheer.stop();
            sound.gasp.play();
          }
          if (newGame.gameOver) sound.gasp.play();
        },
      });
    });
    if (!game?.gameStarted) Rune.actions.gameStarted();
  }, [game?.gameStarted]);

  useEffect(() => {
    if (!gameOver) {
      setFrames(danceFrames);
    } else {
      setFrames(failFrames);
    }

    gameOver === false && setKeyValue(Math.random() * 1e6);
  }, [gameOver, danceFrames, failFrames]);

  useEffect(() => {
    Rune.actions.gameStarted();
    function resize() {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    game?.songNumber &&
      sound[`song${game.songNumber}` as keyof typeof sound].play();
    if (gameOver && game?.songNumber) {
      sound[`song${game?.songNumber}` as keyof typeof sound].stop();
    }
  }, [game?.songNumber, gameOver]);

  function loadScreenRemove() {
    loadContainerRef.current && loadContainerRef.current.destroy();
  }

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

      handleArrowClick({ direction, playerId });
      setEndPoint(undefined);
      setStartPoint(undefined);
    }
  }
  function handleTouchEndOutside() {
    return;
  }

  function handleArrowClick({
    direction,
    playerId,
  }: {
    direction: string;
    playerId: string;
  }) {
    if (gameOver) return;
    Rune.actions.handleClick({ direction, player: playerId });

    gameOver === false && setKeyValue(Math.random() * 1e6);
  }

  return (
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
            scale={0.4}
            anchor={0.5}
            position={[innerWidth / 2, innerHeight / 2]}
          />
        )}

        {/* DanceStage animation */}
        {frames.length > 0 && (
          <AnimatedSprite
            isPlaying={true}
            textures={frames}
            animationSpeed={0.15}
            position={[innerWidth / 2, innerHeight / 2]}
            scale={0.7}
            loop={true}
            ref={animatedSpriteRef}
            onFrameChange={() => animatedSpriteRef.current?.play()}
          />
        )}
        {stageLight.length > 0 && (
          <AnimatedSprite
            isPlaying={true}
            textures={stageLight}
            animationSpeed={0.1}
            position={[innerWidth / 2, 40]}
            scale={0.4}
            ref={stageLightRef}
            onFrameChange={() => stageLightRef.current?.play()}
          />
        )}

        {/* UI elements */}
        {/* Prompt */}
        <Container position={[0, 0]}>
          {game?.prompts[playerId] && uiElements && (
            <Prompt
              direction={game?.prompts[playerId]}
              x={innerWidth / 2}
              y={40}
              roundNumber={round || ROUND_1}
              uiElements={uiElements}
              key={keyValue}
            />
          )}
          {isShowing && (
            <FadingText
              x={innerWidth / 2 - 40}
              y={80}
              text={fadingText}
              isShowing={isShowing}
              playerId={playerId}
            />
          )}

          {game?.scores && (
            <Score
              scores={game?.scores}
              playerId={playerId}
              avatar={
                (allPlayers &&
                  playerId &&
                  allPlayers[playerId as keyof typeof allPlayers].avatarUrl) ||
                ""
              }
            />
          )}
          {timeLeft && (
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
  );
}
export default DanceStage;
