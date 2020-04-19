import React, { useState, useContext, useEffect, useReducer } from 'react';
import { GameContext, PlayContext } from './Game';

import TimedText from './TimedText';

const STORE_RESULT = 'storeResult';
const CORRECT = 'correct';
const TIMEDOUT = 'timedout';

const Round = () => {
  const { secondsPerRound, labels, ref } = useContext(GameContext);
  const { roundState, dispatchRoundState, activeRound, dispatchActiveRound } = useContext(PlayContext);
  
  let [result, setResult] = useState('');

  const [answer, setAnswer] = useState('Let\s start.');
  const [questionStart, setQuestionStart] = useState('You have ');
  const [questionEnd, setQuestionEnd] = useState('to draw this');

  const label = labels[activeRound];

  console.log('round ', activeRound);

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
    if (result === TIMEDOUT) {
      clearCanvas(ref);
      dispatchActiveRound({ type: 'increment' });
      dispatchRoundState({ 
        type: STORE_RESULT,
        payload: {
          label: label,
          result: result
        }
      });
    }
  }, [result, label, dispatchActiveRound, dispatchRoundState, ref]);

  useEffect((() => {
    console.log(`message update, roundState result: ${roundState.result} roundState label ${roundState.label}`);
    console.log(`message update, result: ${result} label ${label} activeRound ${activeRound}`);

    let answer = roundState.result ===  CORRECT ? `You correctly draw a ${roundState.label}. ` 
              : roundState.result ===  TIMEDOUT ? `You run out of time when drawing a ${roundState.label}. ` 
              : activeRound === 0 ? 'Let\'s start. ' : '';

    setAnswer(answer);
    let questionStart = `You have now` ;
    setQuestionStart(questionStart);
    let questionEnd = `seconds to draw a ${label}`;
    setQuestionEnd(questionEnd);
    setResult('');

  }), [roundState.result, roundState.label, label, activeRound, result, setResult]);

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

export { Round, useRounds };
