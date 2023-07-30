import { Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";

function ArrowIcon({
  direction,
  x,
  y,
  playerId,
  handleClick,
  uiElements,
}: {
  direction: string;
  x: number;
  y: number;
  playerId: string;
  uiElements: Record<string, PIXI.Texture<PIXI.Resource>>;
  handleClick: ({
    direction,
    playerId,
  }: {
    direction: string;
    playerId: string;
  }) => void;
}) {
  const [isPressed, setPressed] = useState<boolean>(false);
  const [image, setImage] = useState<PIXI.Texture<PIXI.Resource>>();
  function handleArrowClick(direction: string, player: string) {
    setPressed(true);
    handleClick({ direction, playerId: player });
    setTimeout(() => {
      setPressed(false);
    }, 200);
  }

  useEffect(() => {
    const imageName = isPressed ? `${direction}_pressed` : direction;
    setImage(
      uiElements[imageName as never as keyof PIXI.Texture<PIXI.Resource>]
    );
  }, [direction, isPressed, uiElements]);

  return (
    <>
      {image && (
        <Sprite
          texture={image}
          anchor={0.5}
          x={x}
          y={y}
          scale={0.2}
          pointertap={() => handleArrowClick(direction, playerId)}
          eventMode="static"
        />
      )}
    </>
  );
}
export default ArrowIcon;
