import React, { useReducer, useEffect, useState, useContext, createContext } from "react";
import { Link } from "react-router-dom";

import { getPrediction } from "./helpers.js";
import { useRounds } from './Round'; 
import { Canvas } from './Canvas'; 
import { Controls } from './Controls';

const labels = require("./labels.json");

const GameContext = createContext({});
const PlayContext = createContext({});

const ref = React.createRef();

const STORE_RESULT = 'storeResult';

const initialPoints = 0;
const secondsPerRound = 20;

const reducePoints = (pointsState, action) => {
  switch(action.type) {
    case 'increment': 
      return pointsState + 1;
    case 'reset':
      return initialPoints;
    default:
      return pointsState;
  }
}

const Result = (props) => {
  const points = props.points;
  const maxPoints = props.maxPoints;

  const level = points/maxPoints;
  if (level >= 0.75) {
    return (
      <div>
        Great Job! You did {points} out of {maxPoints}! You like to play again?
      </div>)}
  else if (level < 0.75 && level >= 0.5) {
    return (
      <div>
        Not bad! You did {points} out of {maxPoints}! Like to improve and play again?
      </div>)} 
  else {
    return (
    <div>
      Whoops... you did {points} out of {maxPoints}! Try harder and play again!
    </div>)
  }
}

const Play = () => { 
  const { toggleGameEnded } = useContext(GameContext);

  const reduceRoundState = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case STORE_RESULT: 
        let newState = {...state, 
          label: payload.label, 
          result: payload.result};
          console.log('reduceRoundState ', newState);
          return newState;
      default:
        return state;
    }
  }

  const initialRoundState = {
    label: '',
    result: ''
  };

  const [rounds, activeRound, dispatchActiveRound, roundState, dispatchRoundState] 
          = useRounds(labels, reduceRoundState, initialRoundState);

  useEffect(() => {
    if (activeRound === labels.length) {
      toggleGameEnded();
    }
  }, [activeRound, toggleGameEnded]);

  let round = rounds[activeRound];

  const [prediction, setPrediction] = useState('');

  return (
    <div>
       <PlayContext.Provider value={{
            activeRound,
            dispatchActiveRound,
            roundState,
            dispatchRoundState,
            prediction,
            setPrediction
          }}>
        {round}
        <Canvas />
        <Controls />    
      </PlayContext.Provider>
      <Link to="/">Home</Link>     
    </div>
  ) 
}
const Game = ({ model }) => {
  const maxPoints = labels.length; 
  const [points, dispatchPoints] = useReducer(reducePoints, initialPoints);

  const [gameEnded, setGameEnded] = useState(false);
  
  const toggleGameEnded = () => {
    setGameEnded(!gameEnded);
  }

  return (
    <GameContext.Provider value={{ model, ref, labels, secondsPerRound, 
                                   dispatchPoints, getPrediction, toggleGameEnded }}>
    {gameEnded 
      ? (
        <div>
          <Result points={points} maxPoints={maxPoints} />
          <div>
            <button onClick={toggleGameEnded}>Play Again</button>
          </div>
        </div>
        )
      : (<Play key={gameEnded} />)
    }</GameContext.Provider>
  );
}

export default Game;
export { GameContext, PlayContext };
