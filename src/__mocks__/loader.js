export const model =  {
    predict: async function(tensor) {
      return new Promise(function(resolve, reject) { 
          console.log("Tensor", tensor);
          resolve(0);
  
      }).catch(e => console.log("Error in model prediction:", e));
    }
  };
  export async function loadModel() {
    return model;
  }