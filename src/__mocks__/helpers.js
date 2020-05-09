/*
function preprocessCanvas(canvas) {
  // Preprocess image for the network
  return  new Float32Array(784).fill(1);
}
*/
export async function getPrediction(canvas, model) { 
  //const tensor = preprocessCanvas(canvas);
  const argMax = [0]; 
  return argMax;
}
export function shuffle(labels) {
  const indices = [...Array(labels.length).keys()];
  return [labels, indices];
}
