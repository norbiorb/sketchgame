import React, { useContext } from "react";

import { GameContext } from './Game';

function Controls() {
  const { ref } = useContext(GameContext);

  return (
    <div className="controls">
      <button
        className="nes-btn is-warning controls-button"
        onClick={() => {
          const canvas = ref.current;
          const ctx = canvas.getContext("2d");
          ctx.fillRect(0, 0, canvas.height, canvas.width);
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
}

export { Controls };