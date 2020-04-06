import React, { useContext } from "react";
import { GameContext } from './Game';
import { PlayContext } from './Round';
import { getPrediction } from "./helpers.js";
function Controls() {
  const { model, ref, labels } = useContext(GameContext);
  const { setPrediction, dispatchActiveRound } = useContext(PlayContext);

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
        onClick={
          () => {
          getPrediction(ref, model)
            .then((prediction) => {
              return setPrediction(labels[prediction[0]])
            })
          }
        }
      >
        Predict the drawing.
      </button>
      <button
        onClick={() => {
          dispatchActiveRound({ type: 'increment' });
        }}
      >
        Next Round
      </button>
    </div>
  );
}

export { Controls };