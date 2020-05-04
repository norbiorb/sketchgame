import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";

import "./index.css";
import App from "./App";
import Game from "./Game";
import * as serviceWorker from "./serviceWorker";

async function loadModel() {
  console.log("Model loading...");
  // load the model using a HTTPS request (where you have stored your model files)
  return await tf
  .loadLayersModel("./model/model.json")
  .then(console.log("Loaded.")).catch(e => console.log(e));
}

const Navigation = ({ model }) => {

  console.log(model);
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