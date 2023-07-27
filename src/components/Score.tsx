import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";

// Define a custom text style for the score and time left
const scoreTextStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: ["#ffffff", "#00aaff"], // You can use gradient fill for a more appealing look
  stroke: "#000000",
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowDistance: 2,
  wordWrap: true,
  wordWrapWidth: 200, // Adjust the wordWrapWidth as needed
});

function Score({ scores, playerId }: { scores: object; playerId: string }) {
  return (
    <>
      {/* Score */}
      <Text
        text={`Score: ${scores[playerId as keyof typeof scores]}`}
        style={scoreTextStyle}
        x={10}
        y={50}
      />
    </>
  );
}

export default Score;
