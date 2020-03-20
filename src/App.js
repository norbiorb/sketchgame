import React, { useReducer } from "react";
import { useRounds } from './Round'; 

const labels = require("./labels.json");

const AppContext = React.createContext({});

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

const App = ({ model }) => {

  const [ dispatch] = useReducer(initialPoints, reducePoints);

  return (
    <div>
      <AppContext.Provider value={{ model, ref, labels, dispatch }}>
        {
          useRounds(20, labels)
        }
      </AppContext.Provider>
    </div>
  )
}

export default App;
export { AppContext };
