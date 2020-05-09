import * as tf from "@tensorflow/tfjs";

export async function loadModel() {
    console.log("Model loading...");
    // load the model using a HTTPS request (where you have stored your model files)
    return await tf
    .loadLayersModel("./model/model.json")
    .then(console.log("Loaded.")).catch(e => console.log(e));
  }