import { Stage } from "@pixi/react";
import DanceStage from "./DanceStage";
function App() {
  return (
    <Stage
      options={{
        background: 0xeef1f5,
        autoDensity: true,
      }}
    >
      <DanceStage />
    </Stage>
  );
}

export default App;
