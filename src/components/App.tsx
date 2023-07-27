import { Stage } from "@pixi/react";
import DanceStage from "./DanceStage";
function App() {
  return (
    <div className="frame">
      <Stage options={{ background: 0xeef1f5, autoDensity: true }}>
        <DanceStage />
      </Stage>
    </div>
  );
}

export default App;
