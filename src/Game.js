import React, { useReducer, useState, createContext } from "react";
import { Link } from "react-router-dom";

import { Play } from './Play';
import { TypedText } from './TypedText';

import { getPrediction, shuffle } from "./helpers.js";

const labelsOrig = require("./labels.json");

let [labels, indices] = shuffle(labelsOrig);
const GameContext = createContext({});

const ref = React.createRef();

const STORE_RESULT = 'storeResult';
const CORRECT = 'correct';
const TIMEDOUT = 'timedout';

const secondsPerRound = 20;
const bonustime = 5;

const initialPoints = {
  points: 0,
  bonus: 0
}

const hasBonus = (time) => {
  return time <= bonustime;
}

const reducePoints = (pointsState, action) => {
  switch(action.type) {
    case 'increment': 
      if (hasBonus(action.payload.timeUsed)) {
        return {
          points: pointsState.points + 1,
          bonus: pointsState.bonus + 1
        };
      } else {
        return {...pointsState, 
          points: pointsState.points + 1
        };
      }
    case 'reset':
      return initialPoints;
    default:
      return pointsState;
  }
}

const Result = (props) => {
  const { pointsState, maxPoints } = props;
  const points = pointsState.points;
  const bonus = pointsState.bonus;

  const level = points/maxPoints;

  const message = 
    level >= 0.75 ? `Great Job! You won! You did ${points} out of ${maxPoints} and too ${bonus} bonus points for sketching fast! You like to play again?`
    : level < 0.75 && level >= 0.5  ? `You won! Not bad! You did ${points} out of ${maxPoints} with a bonus of ${bonus} points for sketching fast. Like to improve and play again?`
    : `Whoops... you did ${points} out of ${maxPoints}!  Your additional bonus is ${bonus} points for sketching fast.Try harder and play again!`;

    return ( <TypedText strings={[message]} />);
}


const Game = ({ model }) => {
  const maxPoints = labelsOrig.length; 
  const [pointsState, dispatchPoints] = useReducer(reducePoints, initialPoints);

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
      indices,
      STORE_RESULT,
      CORRECT,
      TIMEDOUT,
      bonustime
    }}>
    {gameEnded 
      ? (
        <div className="nes-container is-dark with-title">
           <h1 className="title">Sketch</h1>
           <div className="result">
            <Result pointsState={pointsState} maxPoints={maxPoints} />
          </div> 
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
export { GameContext };
