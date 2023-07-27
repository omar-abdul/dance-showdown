import { Sprite } from "@pixi/react";

function Prompt({
  direction,
  x,
  y,
}: {
  direction: string;
  x: number;
  y: number;
}) {
  return (
    <Sprite
      image={`/prompts_${direction}.png`}
      scale={0.5}
      anchor={0.5}
      x={x}
      y={y}
    />
  );
}

export default Prompt;
