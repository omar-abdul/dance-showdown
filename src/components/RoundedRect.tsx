import { Graphics } from "@pixi/react";

function RoundedRect({
  x,
  y,
  width,
  height,
  color,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}) {
  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(color, 0.6);
        g.lineStyle({ width: 3, color: "#000000" });
        g.drawRoundedRect(x, y, width, height, 30);
      }}
      anchor={0.5}
    />
  );
}

export default RoundedRect;
