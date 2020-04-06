import React, { useState, useContext, useEffect, useReducer } from 'react';
import { GameContext, PlayContext } from './Game';

const STORE_RESULT = 'storeResult';
const CORRECT = 'correct';
const TIMEDOUT = 'timedout';

const useCountdown = (secondsPerRound, isActive) => {
  const [seconds, setSeconds] = useState(secondsPerRound);

  useEffect(() => {
    let interval;
    if (isActive) {
      if (seconds > 0) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds - 1);
        }, 1000);
      } else {
        clearInterval(interval);
      } 
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    }
  }, [seconds, isActive]);

  return [seconds];
};

const Countdown = ({secondsPerRound, isActive, callback}) => {
  let [seconds] = useCountdown(secondsPerRound, isActive);

  useEffect(() => {
    callback(seconds);
  }, [seconds, callback]);
  
  return (<span> {seconds} </span>);
}

const Round = () => {
  const { secondsPerRound, labels, dispatchPoints, ref } = useContext(GameContext);
  let { roundState, dispatchRoundState, prediction, setPrediction, activeRound, dispatchActiveRound } = useContext(PlayContext);

  let [result, setResult] = useState('');

  const label = labels[activeRound];

  const isTimedout = (seconds) => {
    if (seconds <= 0) {
      setResult(TIMEDOUT);
    }
  }

  const clearCanvas = (ref) => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, canvas.height, canvas.width);
  }
 
  useEffect(() => {
      console.log('round prediction', prediction);
  }, [prediction]);

  useEffect(() => {
    setPrediction('');
  }, [roundState, setPrediction]); 

  useEffect(() => {
    if (result === CORRECT || result === TIMEDOUT) {
      dispatchActiveRound({ type: 'increment' });
      dispatchRoundState({ 
        type: STORE_RESULT,
        payload: {
          label: label,
          result: result
        }
      });
      result === CORRECT &&  dispatchPoints({type: 'increment'});  
      clearCanvas(ref);
    }
  }, [result, label, dispatchActiveRound, dispatchRoundState, dispatchPoints, ref]);

  useEffect(() => {
      if (label === prediction)  { 
        setResult(CORRECT);  
      }
  }, [label, result, prediction] );

  return ( 
    <div><div>Sketch Round {activeRound +1} of {labels.length} Rounds</div> 
        {roundState.result === CORRECT && (<div><span>You correctly draw a {roundState.label}</span></div>)}
        {roundState.result === TIMEDOUT &&  ( <div><span>You run out of time when drawing a {roundState.label}.</span></div> )}
        <div>You have  
          <Countdown key={label} secondsPerRound={secondsPerRound} isActive={true} callback={isTimedout}/> 
             seconds to draw a {label} and you draw a {prediction}
        </div>
    </div>)
}

const useRounds = (labels, reduceRoundState, initialRoundState) => {

  const reduceActiveRound = (state, action) => {
    switch(action.type) {
      case 'increment': 
        return state + 1;
      case 'reset':
        return 0;
      default:
        return state;
    }
  }

  let [activeRound, dispatchActiveRound] = useReducer(reduceActiveRound, 0);
  let [roundState, dispatchRoundState] = useReducer(reduceRoundState, initialRoundState);

  let rounds = Array.apply(null, labels).map(
    (label, index) => {
      return (activeRound === index) ? 
         (<Round key={index} />) 
        : null;    
  });

  return [rounds, activeRound, dispatchActiveRound, roundState, dispatchRoundState];
};

export { Round, useRounds, PlayContext };
