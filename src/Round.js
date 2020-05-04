import React, { useState, useContext, useEffect, useReducer } from 'react';

import { GameContext } from './Game';
import { PlayContext } from './Play';
import { TimedText } from './TimedText';

const Round = () => {
  const { secondsPerRound, labels, bonustime, CORRECT ,TIMEDOUT } = useContext(GameContext);
  const { roundState, activeRound, handleTimeout } = useContext(PlayContext);
  
  const label = labels[activeRound];

  const [answer, setAnswer] = useState('Let\'s start');
  const [questionStart, setQuestionStart] = useState('You have');
  const [questionEnd, setQuestionEnd] = useState(`seconds to draw a ${label} in the canvas on the left.`);
  
  useEffect((() => {
    if (activeRound !== 0) {
      let answer = roundState.result ===  CORRECT ? 
        roundState.timeUsed <= bonustime ? `You know you made an awsome ${roundState.label} sketch in only ${roundState.timeUsed} seconds!` 
        : `Well Done! You draw a ${roundState.label} in ${roundState.timeUsed} seconds. Can you do faster? ` 
      : roundState.result ===  TIMEDOUT ? `You run out of time when drawing a ${roundState.label}. ` 
      : '';

      setAnswer(answer);
      let questionStart = `You have now` ;
      setQuestionStart(questionStart);
      let questionEnd = `seconds to draw a ${label}`;
      setQuestionEnd(questionEnd);
    }
  }), [activeRound, roundState.result, roundState.label, roundState.timeUsed, label, bonustime, CORRECT, TIMEDOUT]);

  return ( 
    <div className="status-text">
      <TimedText 
        key={label} 
        label={label} 
        strings={{answer, questionStart, secondsPerRound, questionEnd}} 
        callback={handleTimeout}
      > 
      </TimedText>
    </div>
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

  const [activeRound, dispatchActiveRound] = useReducer(reduceActiveRound, 0);
  const [roundState, dispatchRoundState] = useReducer(reduceRoundState, initialRoundState);

  const rounds = Array.apply(null, labels).map(
    (label, index) => {
      return (activeRound === index) ? 
         (<Round key={index} />) 
        : null;    
  });

  return [rounds, activeRound, dispatchActiveRound, roundState, dispatchRoundState];
};

export { Round, useRounds };
