import { Sprite } from "@pixi/react";
import { useEffect, useState } from "react";

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
  uiElements: any;
  handleClick: ({
    direction,
    playerId,
  }: {
    direction: string;
    playerId: string;
  }) => void;
}) {
  const [isPressed, setPressed] = useState<boolean>(false);
  const [image, setImage] = useState<any>();
  function handleArrowClick(direction: string, player: string) {
    setPressed(true);
    handleClick({ direction, playerId: player });
    setTimeout(() => {
      setPressed(false);
    }, 200);
  }

  useEffect(() => {
    const imageName = isPressed ? `${direction}_pressed` : direction;
    setImage(uiElements[imageName as keyof typeof uiElements]);
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
