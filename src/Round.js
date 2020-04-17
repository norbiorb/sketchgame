import React, { useState, useContext, useEffect, useReducer } from 'react';
import { GameContext, PlayContext } from './Game';

import TimedText from './TimedText';

const STORE_RESULT = 'storeResult';
const CORRECT = 'correct';
const TIMEDOUT = 'timedout';

const Round = () => {
  const { secondsPerRound, labels, dispatchPoints, ref } = useContext(GameContext);
  let { roundState, dispatchRoundState, prediction, setPrediction, activeRound, dispatchActiveRound } = useContext(PlayContext);

  let [result, setResult] = useState('');

  let [answer, setAnswer] = useState('Let\s start.');
  let [questionStart, setQuestionStart] = useState('You have ');
  let [questionEnd, setQuestionEnd] = useState('to draw this');

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

  useEffect((() => {
    console.log(`message update, result: ${roundState.result} label ${roundState.label}`);

    let answer = roundState.result ===  CORRECT ? `You correctly draw a ${roundState.label}. ` 
              : roundState.result ===  TIMEDOUT ? `You run out of time when drawing a ${roundState.label}. ` 
              : activeRound === 0 ? 'Let\'s start. ' : '';

    setAnswer(answer);
    let questionStart = `You have now` ;
    setQuestionStart(questionStart);
    let questionEnd = `seconds to draw a ${label}`;
    setQuestionEnd(questionEnd);

  }), [roundState.result, roundState.label, label, activeRound]);

  return ( 
    <TimedText 
      key={label} 
      label={label} 
      strings={{answer, questionStart, secondsPerRound, questionEnd}} 
      callback={isTimedout}
      />
  );
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
