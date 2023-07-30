import { Container, Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import { ROUND_1, ROUND_2, ROUND_3, ROUND_4 } from "../lib/rounds";
import RoundedRect from "./RoundedRect";
import * as PIXI from "pixi.js";

function Prompt({
  direction,
  x,
  y,
  roundNumber,
  uiElements,
  freeRound,
  playerId,
}: {
  direction: string;
  x: number;
  y: number;
  roundNumber: number;
  uiElements: Record<string, PIXI.Texture<PIXI.Resource>>;
  freeRound: boolean;
  playerId: string;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    if (freeRound && playerId) return;
    if (!freeRound) {
      if (uiElements) {
        let timeOut: number = ROUND_1;
        if (roundNumber === ROUND_1) timeOut = 700;
        else if (roundNumber === ROUND_2) timeOut = 400;
        else if (roundNumber === ROUND_3) timeOut = 300;
        else if (roundNumber === ROUND_4) timeOut = 200;
        setIsHidden(false);
        setTimeout(() => {
          setIsHidden(true);
        }, timeOut);
      }
    }
  }, [direction, roundNumber, uiElements, freeRound, playerId]);

  return (
    <>
      {uiElements && (
        <Container>
          <RoundedRect
            x={x - 42.5}
            y={y - 42.5}
            width={85}
            height={85}
            color="#ffffff"
          />
          <Sprite
            texture={
              isHidden === false
                ? uiElements[`prompt_${direction}`]
                : uiElements[`prompt_question`]
            }
            scale={0.5}
            anchor={0.5}
            x={x}
            y={y}
          />
        </Container>
      )}
    </>
  );
}

export default Prompt;
