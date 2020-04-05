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
  callback(seconds);
  return (<span>{seconds}</span>);
}

const Round = () => {
  const { secondsPerRound, labels, dispatchPoints, setGameEnded } = useContext(GameContext);
  let { roundState, dispatchRoundState, prediction, setPrediction, activeRound, dispatchActiveRound } = useContext(PlayContext);

  let [solved, setSolved] = useState(false);
  let [result, setResult] = useState('');

  const label = labels[activeRound];
 
  useEffect(() => {
      console.log('round prediction', prediction);
  }, [prediction]);

  useEffect(() => {
    setPrediction('');
  }, [roundState, setPrediction]); 

  useEffect(() => {
    if (solved) {
      dispatchActiveRound({ type: 'increment' });
      dispatchRoundState({ 
        type: STORE_RESULT,
        payload: {
          label: label,
          result: result
        }
      });
    }
  }, [solved, result, label, dispatchActiveRound, dispatchRoundState]);

  const isTimedout = (seconds) => {
    if (seconds < 0) {
      setResult(TIMEDOUT);
      setSolved(true);
    }
  }

  useEffect(() => {
    const isCorrectPrediction = (label, prediction) => {
      if (label === prediction)  { 
        setResult(CORRECT);
        setSolved(true);
        dispatchPoints({type: 'increment'});     
      }
    }
    console.log('isCorrectPrediction');
    isCorrectPrediction(label, prediction);
  }, [label, result, prediction, dispatchPoints, dispatchRoundState] );

  return ( 
    <div><div>Sketch Round {activeRound +1} of {labels.length} Rounds</div> 
        {roundState.result === CORRECT && (<div><span>You correctly draw a {roundState.label}</span></div>)}
        {roundState.result === TIMEDOUT &&  ( <div><span>You run out of time when drawing a {roundState.label}.</span></div> )}
        <div>You have  
          <Countdown key={label} secondsToPlay={secondsPerRound} isActive={true} callback={isTimedout}/> 
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
