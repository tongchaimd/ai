import Vectorary from "./vectorary"

class NeuralNetwork {
  /* [2, 2] 2 input neurons & 2 output neurons
   * [2] 2 neurons but the output is the same as the input
   * [3, 2, 1] 3 input neurons & 1 hidden layer of 2 neurons & 1 output neuron
   */
  constructor(layoutArray) {
    this.layoutArray = layoutArray;
    this.layerCount = this.layoutArray.length - 1;
    this.inputSize = this.layoutArray[0];
    this.outputSize = this.layoutArray[this.layerCount - 1];
    this.layers = [];
    for (let l = 0; l < this.layerCount; l++) {
      const prevLayerSize = this.layoutArray[l];
      if (l < this.layerCount - 1) {
        this.layers.push(new Layer(prevLayerSize, this.layoutArray[l+1]));
      } else {
        this.layers.push(new Layer(prevLayerSize, this.layoutArray[l+1], true));
      }
    }
  }

  process(inputArray) {
    this.latestInputArray = inputArray;
    let currentData = inputArray.slice();
    for (let l = 0; l < this.layerCount; l++) {
      currentData = this.layers[l].process(currentData);
    }
    return currentData;
  }

  gradientWrtNthInput(n) {
    if (this.outputSize !== 1) {
      throw new Error("gradientWrtNthInput function can only be used on 1 output network");
    }

    let rightDeltaArray = [1]; // output
    for (let l = this.layerCount - 1; l >= 0; l--) {
      rightDeltaArray = this.layers[l].backward(rightDeltaArray);
    }

    let leftAArray = Vectorary.zeroes(this.inputSize);
    leftAArray[n] = this.latestInputArray[n];
    for (let l = 0; l < this.layerCount; l++) {
      leftAArray = this.layers[l].gradientForward(leftAArray);
    }
    return leftAArray[0];
  }

  learn(alpha, errorArray) {
    let rightDeltaArray = errorArray; // output
    for (let l = this.layerCount - 1; l >= 0; l--) {
      if (l === this.layerCount - 1) { // first loop
        rightDeltaArray = this.layers[l].backward(rightDeltaArray);
      } else {
        rightDeltaArray = this.layers[l].backward(rightDeltaArray, this.layers[l+1].weights());
      }
    }

    let leftAArray = this.latestInputArray;
    for (let l = 0; l < this.layerCount; l++) {
      leftAArray = this.layers[l].update(alpha, leftAArray);
    }
  }
}

class Layer {
  constructor(inputCount, neuronCount, isOutput = false) {
    this.neurons = [];
    this.isOutput = isOutput;
    for (let n = 0; n < neuronCount; n++) {
      const newNeuron = new Neuron(inputCount);
      if (this.isOutput) {
        newNeuron.setLinearActivation(false);
      }
      this.neurons.push(newNeuron);
    }
  }

  process(inputArray) {
    return this.neurons.map(neuron => neuron.process(inputArray));
  }

  backward(rightDeltaArray, rightWeightMatrix) {
    if (this.isOutput) {
      const deltaArray = [];
      for (let n = 0; n < this.neurons.length; n++) {
        this.neurons[n].delta = this.neurons[n].dz * rightDeltaArray[n];
        deltaArray.push(this.neurons[n].delta);
      }
      return deltaArray;
    }
    return this.neurons.map((neuron, n) => neuron.backward(rightDeltaArray, rightWeightMatrix.map(w => w[n])));
  }

  update(alpha, leftAArray) {
    return this.neurons.map(neuron => neuron.update(alpha, leftAArray));
  }

  weights() {
    return this.neurons.map(neuron => neuron.weights);
  }
}

class Neuron {
  constructor(inputSize) {
    this.weights = Vectorary.zeroes(inputSize);
    for (let i = 0; i < inputSize; i++) {
      this.weights[i] += (Math.random() * 2.0) - 1.0;
    }
    this.bias = (Math.random() * 2.0) - 1.0;
  }

  setLinearActivation(isLinear) {
    this.isLinear = isLinear;
  }

  process(inputArray) {
    this.z = Vectorary.dot(inputArray, this.weights) + this.bias;
    if (this.isLinear) {
      this.a = this.z;
      this.dz = 1.0;
    } else {
      this.a = this.tanh(this.z);
      //console.log("z");
      //console.log(this.z);
      //console.log("exp z");
      //console.log(Math.exp(this.z));
      this.dz = this.dtanh(this.z);
    }
    return this.a;
  }

  gradientForward(leftAArray) {
    return Vectorary.scale(this.delta, leftAArray);
  }

  backward(rightDeltaArray, rightWeights) {
    //console.log("rightDeltaArray");
    //console.log(rightDeltaArray);
    //console.log("rightWeights");
    //console.log(rightWeights);
    //console.log("dz");
    //console.log(this.dz);
    this.delta = Vectorary.dot(rightDeltaArray, rightWeights) * this.dz;
    return this.delta;
  }

  update(alpha, leftAArray) {
    const ad = Vectorary.scale(this.delta, leftAArray);
    //console.log("leftAArray");
    //console.log(leftAArray);
    //console.log("delta");
    //console.log(this.delta);
    //console.log("ad");
    //console.log(ad);
    //console.log("dW");
    //console.log(Vectorary.scale(alpha, ad));
    this.weights = Vectorary.sub(this.weights, Vectorary.scale(alpha, ad));
    this.bias = this.bias - (alpha * this.delta);
    return this.a;
  }

  tanh(input) {
    return (2.0 / (1.0 + Math.exp(-2.0 * input))) - 1.0;
  }

  dtanh(input) {
    return 4 / Math.pow(Math.exp(-input) + Math.exp(input), 2);
  }
}

export default NeuralNetwork;
