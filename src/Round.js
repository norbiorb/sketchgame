import React, { useState, useContext, createContext } from 'react';
import { Controls } from './Controls';
import { Canvas } from './Canvas'; 

const RoundContext = createContext({});
const PredictionContext = createContext({});

const Round = (props) => {
  const { prediction } = useContext(PredictionContext);
  const [seconds, setSeconds] = useState(props.seconds);
  
  const countdown = (seconds) => {
      const interval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
          clearInterval(interval);
        } else {
          setSeconds(seconds);
        }
      }, 1000, seconds);
    }

  countdown(seconds);

  return (
      <div>{ seconds <= 0 ?  ( <div><span>You run out of time. draw a {props.label} and you draw a {prediction}</span></div> ) 
        : ( <div>{ prediction === props.label ?  (<div><span>You correctly draw a {props.label}</span></div>) 
          : ( <div><span>You have {seconds} seconds to draw a {props.label} and you draw a {prediction}</span></div>)
        }  
      </div> )} 
      </div>
  );
}
const useRounds = (seconds, labels) => {
    let [prediction, setPrediction] = useState(''); // Sets default label to empty string.
    let label = labels[0];
    return (
      <RoundContext.Provider value={ {label, seconds}} >
        <PredictionContext.Provider value={{ prediction, setPrediction }} >
          <Canvas />
          <Controls />     
          <Round label={labels[0]} seconds={seconds} />
        </PredictionContext.Provider>
      </RoundContext.Provider>
    );
  };

export { Round, useRounds, PredictionContext };
