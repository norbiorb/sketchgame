import React, { createContext, useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";

import { GameContext } from './Game';
import { getPrediction } from "./helpers.js";
import { useRounds } from './Round'; 
import { Canvas } from './Canvas'; 
import { Controls } from './Controls';

const PlayContext = createContext({});

const Play = () => { 
  const { 
      toggleGameEnded, 
      labels, 
      indices, 
      dispatchPoints, 
      model, 
      secondsPerRound, 
      ref, 
      STORE_RESULT, 
      CORRECT, 
      TIMEDOUT 
  } = useContext(GameContext);
  
  const timerRef = useRef();
  
  const reduceRoundState = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case STORE_RESULT: 
        let newState = {...state, 
          label: payload.label, 
          result: payload.result,
          timeUsed: payload.timeUsed
          };
          return newState;
      default:
        return state;
    }
  }
  
  const initialRoundState = {
    label: '',
    result: '',
    timeUsed: secondsPerRound,
    points: 0
  };
  
  const [rounds, activeRound, dispatchActiveRound, roundState, dispatchRoundState] 
          = useRounds(labels, reduceRoundState, initialRoundState);

  useEffect(() => {
    if (activeRound === labels.length) {
      toggleGameEnded();
    }
  }, [activeRound, toggleGameEnded, labels]);

  const round = rounds[activeRound];

  const [result, setResult] = useState('');

  const clearCanvas = (ref) => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, canvas.height, canvas.width);
  }

  const getTime = (timerRef) => {
    return timerRef.current.innerHTML;
  }

  const setTime = (timerRef,time) => {
    timerRef.current.innerHTML = time;
  }
  
  const handleTimeout = (timeleft) => {
    if (timeleft <= 0) {
      clearCanvas(ref);
      setResult(TIMEDOUT);
      dispatchActiveRound({ type: 'increment' });
      dispatchRoundState({ 
        type: STORE_RESULT,
        payload: {
          label: labels[activeRound],
          result: TIMEDOUT,
          timeUsed: secondsPerRound
        }
      });
    }
  }

  const processCorrectPrediction = () => {
    const timeleft = parseInt(getTime(timerRef));

    // in case a sketch is done before initializing the new round
    if (!Number.isNaN(timeleft)) {
      const timeUsed = secondsPerRound - timeleft;
      setResult(CORRECT);
      dispatchPoints({type: 'increment', 
        payload: {
          timeUsed: timeUsed,
        }
      });
      clearCanvas(ref);
      dispatchActiveRound({ type: 'increment' });

      dispatchRoundState({
        type: STORE_RESULT,
        payload: {
          label: labels[activeRound],
          result: CORRECT,
          timeUsed: timeUsed
        }
      });
    }
  }

  const evaluatePrediction = (prediction) => {   
    const label = labels[activeRound];

    // use permutation indices to get the correct label
    const predictedLabel = labels[indices[prediction[0]]];
    if (label === predictedLabel) {
      processCorrectPrediction();
    } else {
      console.log('Predicted Label: ', predictedLabel);
    }
  }
  
  const handlePrediction = async () => {
    const prediction = await getPrediction(ref, model);
    evaluatePrediction(prediction);
  }; 

  return (
    <div className="nes-container with-title is-dark">
    <h2 className="title">Sketch Round {activeRound +1} of {labels.length} Rounds</h2> 
      <header className="header">
        <Link className=" nes-btn" to="/">Home</Link> 
      </header> 
      <PlayContext.Provider value={{
            activeRound,
            dispatchActiveRound,
            roundState,
            dispatchRoundState,
            result,
            setResult,
            timerRef,
            setTime,
            handlePrediction,
            handleTimeout
      }}>   
        <main className="main"> 
          <div className="canvas-wrapper">       
            <Canvas />
          </div> 
          <div className="status">
          {round} 
          <Controls />    
          </div>
        </main>
      </PlayContext.Provider>
    </div>      
  ) 
}

export { Play, PlayContext }