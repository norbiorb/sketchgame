import React, { useReducer } from "react";
import { Link } from "react-router-dom";
import { useRounds } from './Round'; 

const labels = require("./labels.json");

const GameContext = React.createContext({});

const ref = React.createRef();

const initialPoints = 0;

const reducePoints = (pointsState, action) => {
  switch(action.type) {
    case 'increment': 
      return pointsState++;
    case 'reset':
      return initialPoints;
    default:
      return pointsState;
  }
}

const Game = ({ model }) => {

  const [points, dispatch] = useReducer(initialPoints, reducePoints);

  return (
    <div>
      <GameContext.Provider value={{ model, ref, labels, points, dispatch }}>
        {
          useRounds(20, labels)
        }
      </GameContext.Provider>
      <Link to="/">Home</Link>
    </div>
  )
}

export default Game;
export { GameContext };
