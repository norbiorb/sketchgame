import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Game from "./Game";
import * as serviceWorker from "./serviceWorker";
import * as tf from "@tensorflow/tfjs";

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
  <Router>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route 
        exact path="/game"
        render={(props) => <Game {...props} model={model} />} 
      />
    </Switch>
  </Router>) 
}

ReactDOM.render(
  <Navigation model={loadModel()}/>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
