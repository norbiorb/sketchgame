import React, { useState, useContext, createContext, useEffect } from 'react';
import { Controls } from './Controls';
import { Canvas } from './Canvas'; 

const RoundContext = createContext({});

const CORRECT = 'correct';
const PLAYING = 'playing';
const TIMEDOUT = 'timedout';

const Round = (props) => {
  let { prediction } = useContext(RoundContext);
  let [seconds, setSeconds] = useState(props.seconds);
  let [evaluation, setEvaluation] = useState(PLAYING);
  const label = props.label;

  useEffect(() => {
    let interval;
    if (evaluation === PLAYING) {
      interval = setInterval(() => {
        seconds--;
        if (prediction === label && seconds >= 0) {
          setEvaluation(CORRECT);
          clearInterval(interval);
        } else if (prediction !== label && seconds < 0 ) {
            setEvaluation(TIMEDOUT);
            clearInterval(interval);        
        } else {
            setSeconds(seconds);
        }
      }, 1000, seconds);
    }

    return () => {if (interval) { clearInterval(interval); }};

  }, [prediction, label, seconds, evaluation]);

  switch (evaluation) {
    case 'correct': 
      return (<div><span>You correctly draw a {label}</span></div>);
    case 'timedout':
   return ( <div><span>You run out of time. draw a {label} and you draw a {prediction}</span></div> ) 
    default:
      return ( <div><span>You have {seconds} seconds to draw a {label} and you draw a {prediction}</span></div>)
  }
}
const useRounds = (seconds, labels) => {
    let [prediction, setPrediction] = useState(''); // Sets default label to empty string.

    let label = labels[0];
    return (
      <RoundContext.Provider  
        value={{ label, seconds, prediction, setPrediction }} >
          <Canvas />
          <Controls />     
          <Round label={labels[0]} seconds={seconds} />
      </RoundContext.Provider>
    );
  };

export { Round, useRounds, RoundContext };
