import { Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";

function SwipeLine({
  start,
  end,
  isSwiping,
}: {
  start: { x: number; y: number } | undefined;
  end: { x: number; y: number } | undefined;
  isSwiping: boolean;
}) {
  if (!isSwiping) return null;

  return (
    <Graphics
      draw={(g: PIXI.Graphics) => {
        g.clear();

        g.lineStyle(7, "#673AB7");
        start && g.moveTo(start.x, start.y);
        end && g.lineTo(end.x, end.y);
      }}
    />
  );
}

export default SwipeLine;
