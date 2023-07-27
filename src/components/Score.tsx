import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";

// Define a custom text style for the score and time left
const scoreTextStyle = new PIXI.TextStyle({
  dropShadowColor: "#77767b",
  fill: "#ff7800",
  fontFamily: "Comic Sans MS",
  fontSize: 18,
  fontVariant: "small-caps",
  fontWeight: "500",
  padding: 13,
  stroke: "#f6f5f4",
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
