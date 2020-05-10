import React, { createContext, useEffect, useState, useContext, useRef, useReducer } from "react";
import { Link } from "react-router-dom";

import { GameContext } from './Game';
import { getPrediction } from "./helpers.js";
import { Round } from './Round'; 
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
      bonustime,
      CORRECT, 
      TIMEDOUT 
  } = useContext(GameContext);
  
  const timerRef = useRef();
  
  const reduceRoundState = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'increment': 
        let newState = {
          ...state, 
          label: payload.label, 
          result: payload.result,
          timeUsed: payload.timeUsed,
          activeRound: state.activeRound + 1,
          currentLabel: labels[state.activeRound + 1]
          };

        let answer = newState.result ===  CORRECT ? 
        newState.timeUsed <= bonustime ? `You know you made an awsome ${newState.label} sketch in only ${newState.timeUsed} seconds!` 
        : `Well Done! You draw a ${newState.label} in ${newState.timeUsed} seconds. Can you do faster? ` 
        : newState.result ===  TIMEDOUT ? `You run out of time when drawing a ${newState.label}. `
        : '';
        let questionStart = `You have now` ;
        let questionEnd = `seconds to draw a ${labels[newState.activeRound]}`;

        let texts = {
          answer: answer,
          questionStart: questionStart,
          questionEnd: questionEnd,
          secondsPerRound: secondsPerRound.toString()
        }

        newState.texts = texts;
        return newState;

      default:
        return state;
    }
  }
  
  const initialRoundState = {
    activeRound: 0,
    currentlabel: labels[0],
    secondsPerRound: secondsPerRound,
    label: '',
    result: '',
    timeUsed: secondsPerRound.toString(),
    points: 0,
    texts: {
      answer: 'Let\'s start',
      questionStart: 'You have',
      questionEnd: `seconds to draw a ${labels[0]} in the canvas on the left.`,
      secondsPerRound: secondsPerRound.toString()
    }
  };
  
  const [rounds, roundState, dispatchActiveRound] 
          = useRounds(labels, reduceRoundState, initialRoundState);
  
  const activeRound = roundState.activeRound;

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
      dispatchActiveRound({ 
        type: 'increment',
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
      dispatchActiveRound({ 
        type: 'increment',
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
    console.log('Predicted Label: ', predictedLabel);
    if (label === predictedLabel) {
      processCorrectPrediction();
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

const useRounds = (labels, reduceRoundState, initialRoundState) => {

  const [roundState, dispatchActiveRound] = useReducer(reduceRoundState, initialRoundState);

  const rounds = Array.apply(null, labels).map(
    (label, index) => {
      return (roundState.activeRound === index) ? 
         (<Round key={index} state={roundState}/>) 
        : null;    
  });

  return [rounds, roundState, dispatchActiveRound];
};

export { Play, PlayContext }