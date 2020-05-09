import * as tf from "@tensorflow/tfjs";

export function preprocessCanvas(canvas) {
  // Preprocess image for the network
  let tensor = tf
    .browser
    .fromPixels(canvas.current) // Shape: (300, 300, 3) - RGB image
    .resizeNearestNeighbor([28, 28]) // Shape: (28, 28, 3) - RGB image
    .mean(2) // Shape: (28, 28) - grayscale
    .expandDims(2) // Shape: (28, 28, 1) - network expects 3d values with channels in the last dimension
    .expandDims() // Shape: (1, 28, 28, 1) - network makes predictions for "batches" of images
    .toFloat(); // Network works with floating points inputs
    return tensor.div(255.0); // Normalize [0..255] values into [0..1] range
}

export function getPrediction(canvas, model) {
  const tensor = preprocessCanvas(canvas);
  return model
    .then((loadedModel) => {
      return loadedModel.predict(tensor).data();
    }
      )
    //.then(async prediction => await tf.argMax(prediction).data()); // returns an int32 containing the predicted class
    .then(async (prediction) => {
      let argMax = await tf.argMax(prediction).data();
      const max = prediction[argMax];
      console.log(`getPrediction: prediction index: ${argMax} with confidence ${max}`);
      return argMax;
    });
  }

  export function shuffle(labels) {
    const len = labels.length;
    const indices = Array.from(Array(len).keys())
    const shuffled = new Array(len);
    for (let i = 0; i < len-1; i++) {
      let idx = i + Math.floor(Math.random() * (len-i));
      let tmp = indices[idx];
      indices[idx]= indices[i];
      indices[i] = tmp;
    }
    // fill new labels array
    for (let i = 0; i < len; i++) {
      shuffled[indices[i]] = labels[i];
    }
    return [shuffled, indices];
  }