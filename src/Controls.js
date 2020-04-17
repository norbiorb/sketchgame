import React, { useContext } from "react";
import { GameContext } from './Game';
import { PlayContext } from './Round';
import { getPrediction } from "./helpers.js";
function Controls() {
  const { ref } = useContext(GameContext);

  return (
      <button
        className="nes-btn is-warning controls"
        onClick={() => {
          const canvas = ref.current;
          const ctx = canvas.getContext("2d");
          ctx.fillRect(0, 0, canvas.height, canvas.width);
        }}
      >
        Clear Canvas
      </button>
  );
}

export { Controls };