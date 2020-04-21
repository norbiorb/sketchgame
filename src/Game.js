import React, { useReducer, useEffect, useState, useContext, createContext } from "react";
import { Link } from "react-router-dom";

import { TypedText } from './TypedText';

import { getPrediction } from "./helpers.js";
import { useRounds } from './Round'; 
import { Canvas } from './Canvas'; 
import { Controls } from './Controls';

import { shuffle } from './helpers.js';

const labelsOrig = require("./labels.json");

let [labels, indices] = shuffle(labelsOrig);
console.log(`Shuffled ${labels} ${indices}`);

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

  const message = 
    level >= 0.75 ? `Great Job! You won! You did ${points} out of ${maxPoints}! You like to play again?`
    : level < 0.75 && level >= 0.5  ? `You won! Not bad! You did ${points} out of ${maxPoints}! Like to improve and play again?`
    : `Whoops... you did ${points} out of ${maxPoints}! Try harder and play again!`;

    return ( <TypedText strings={[message]} />);
}

const Play = () => { 
  const { toggleGameEnded, labels } = useContext(GameContext);

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
  }, [activeRound, toggleGameEnded, labels]);

  let round = rounds[activeRound];

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
            dispatchRoundState
      }}>   
      <main className="main">   
        <Canvas />
        <div className="status">
        {round}            
        <Controls />
        </div>  
      </main> 
      <button
        className="nes-btn is-warning"
        onClick={() => {
          dispatchActiveRound({ type: 'increment' });
        }}
      >
        Next Round
      </button>
      </PlayContext.Provider>
    </div>      
  ) 
}
const Game = ({ model }) => {
  const maxPoints = labelsOrig.length; 
  const [points, dispatchPoints] = useReducer(reducePoints, initialPoints);

  const [gameEnded, setGameEnded] = useState(false);

  const toggleGameEnded = () => {
    if (gameEnded) {
      [labels, indices] = shuffle(labelsOrig);
      dispatchPoints({type: 'reset'});   
    }  
    setGameEnded(!gameEnded);
  }

  return (
    <GameContext.Provider value={{ 
      model, 
      ref, 
      secondsPerRound, 
      dispatchPoints, 
      getPrediction, 
      toggleGameEnded,
      labels,
      indices
    }}>
    {gameEnded 
      ? (
        <div className="nes-container is-dark with-title">
           <h1 className="title">Sketch</h1> 
          <Result points={points} maxPoints={maxPoints} />
            <div>
            <button className="nes-btn is-warning flex-column" onClick={toggleGameEnded}>Play again</button>
            </div>
            <div>
            <Link className="nes-btn " to="/">Home</Link>  
            </div>
          </div>
        )
      : (<Play className="nes-container is-dark" />)
    }</GameContext.Provider>
  );
}

export default Game;
export { GameContext, PlayContext };
