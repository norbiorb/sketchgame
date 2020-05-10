import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { loadModel } from './loader.js';
import "./index.css";
import App from "./App";
import Game from "./Game";
import * as serviceWorker from "./serviceWorker";

const Navigation = ({ model }) => {
  
  return (
  <Router key="game">
    <Switch>
      <Route 
        exact path="/"
        render={(props) => <App {...props} model={model} />}
      />
      <Route 
        exact path="/game"
        render={(props) => <Game  {...props} model={model} />} 
      />
    </Switch>
  </Router>) 
}

ReactDOM.render(
  <Navigation model={loadModel()}/>,
  document.getElementById("root")
);

serviceWorker.register();