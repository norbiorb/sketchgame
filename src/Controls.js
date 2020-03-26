import React, { useEffect, useContext } from "react";
import { GameContext } from './Game';
import { RoundContext } from './Round';
import { getPrediction } from "./helpers.js";
function Controls() {
  const { model, ref, labels } = useContext(GameContext);
  const { prediction, setPrediction } = useContext(RoundContext);

  useEffect(() => {
    console.log(prediction);
  });

  return (
    <div>
      <button
        onClick={() => {
          const canvas = ref.current;
          const ctx = canvas.getContext("2d");
          ctx.fillRect(0, 0, canvas.height, canvas.width);
        }}
      >
        Clear the canvas.
      </button>
      <button
        onClick={() =>
          getPrediction(ref, model).then(prediction =>
            setPrediction(labels[prediction[0]])
          )
        }
      >
        Predict the drawing.
      </button>
    </div>
  );
}

export { Controls };