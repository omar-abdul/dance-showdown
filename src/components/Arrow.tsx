import { Sprite } from "@pixi/react";
import { useState } from "react";

function ArrowIcon({
  direction,
  x,
  y,
  playerId,
}: {
  direction: string;
  x: number;
  y: number;
  playerId: string;
}) {
  const [isPressed, setPressed] = useState<boolean>(false);
  function handleArrowClick(direction: string, player: string) {
    setPressed(true);
    Rune.actions.handleClick({ direction, player });
    setTimeout(() => {
      setPressed(false);
    }, 200);
  }
  const imageName = isPressed ? `${direction}_pressed` : direction;

  return (
    <Sprite
      image={`${imageName}.png`}
      anchor={0.5}
      x={x}
      y={y}
      scale={0.2}
      pointertap={() => handleArrowClick(direction, playerId)}
      eventMode="static"
    />
  );
}
export default ArrowIcon;
