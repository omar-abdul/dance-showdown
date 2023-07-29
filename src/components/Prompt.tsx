import { Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import { ROUND_1, ROUND_2, ROUND_3 } from "../lib/rounds";

function Prompt({
  direction,
  x,
  y,
  roundNumber,
  uiElements,
}: {
  direction: string;
  x: number;
  y: number;
  roundNumber: number;
  uiElements: any;
}) {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    let timeOut: number = ROUND_1;
    if (roundNumber === ROUND_1) timeOut = 300;
    else if (roundNumber === ROUND_2) timeOut = 150;
    else if (roundNumber === ROUND_3) timeOut = 100;
    setIsHidden(false);
    setTimeout(() => {
      setIsHidden(true);
    }, timeOut);
  }, [direction, roundNumber]);

  return (
    <>
      {uiElements && (
        <Sprite
          texture={
            isHidden === false
              ? uiElements[`prompt_${direction}`]
              : uiElements[`prompt_question`]
          }
          scale={0.4}
          anchor={0.5}
          x={x}
          y={y}
        />
      )}
    </>
  );
}

export default Prompt;
