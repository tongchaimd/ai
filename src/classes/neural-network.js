import Vectorary from "./vectorary"

class NeuralNetwork {
  /* [2, 2] 2 input neurons & 2 output neurons
   * [2] 2 neurons but the output is the same as the input
   * [3, 2, 1] 3 input neurons & 1 hidden layer of 2 neurons & 1 output neuron
   */
  constructor(layoutArray, dontInit = false) {
    if (!dontInit) {
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
  }

  process(inputArray) {
    if (inputArray.length !== this.inputSize) {
      throw new Error("wrong input size");
    }
    this.latestInputArray = inputArray;
    let currentData = inputArray.slice();
    for (let l = 0; l < this.layerCount; l++) {
      currentData = this.layers[l].process(currentData);
    }
    return currentData;
  }

  gradientWrtNthsInputAtState(nArray, state) {
    if (this.outputSize !== 1) {
      throw new Error("gradientWrtNthInput function can only be used on 1 output network");
    }

    this.process(state);
   
    let rightDeltaArray = [1];
    for (let l = this.layerCount - 1; l >= 0; l--) {
      if (l === this.layerCount - 1) { // first loop
        rightDeltaArray = this.layers[l].backward(rightDeltaArray);
      } else {
        rightDeltaArray = this.layers[l].backward(rightDeltaArray, this.layers[l+1].weights());
      }
    }
    const nDeltas = this.layers[0].weights().map(w => {
      const acc = [];
      for (let n = 0; n < nArray.length; n++) {
        acc.push(this.state[n] * w[n]);
      }
      return acc;
    });
    return nDeltas.reduce((acc, d) => Vectorary.sum(acc, d));
  }

  learn(alpha, errorArray) {
    let rightDeltaArray = errorArray;
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

  lerp(towardNn, tau) {
    for (let l = 0; l < this.layerCount; l++) {
      this.layers[l].lerp(towardNn.layers[l], tau);
    }
  }

  clone() {
    const nnClone = new NeuralNetwork(0, true);
    nnClone.layers = this.layers.map(l => l.clone());
    nnClone.layoutArray = this.layoutArray;
    nnClone.layerCount = this.layerCount;
    nnClone.inputSize = this.inputSize;
    nnClone.outputSize = this.outputSize;
    return nnClone;
  }
}

class Layer {
  constructor(inputCount, neuronCount, isOutput = false, dontInit = false) {
    if (!dontInit) {
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

  lerp(towardLayer, tau) {
    for (let n = 0; n < this.neurons.length; n++) {
      this.neurons[n].lerp(towardLayer.neurons[n], tau);
    }
  }

  clone() {
    const layerClone = new Layer(0, 0, 0, true);
    layerClone.neurons = this.neurons.map(n => n.clone());
    return layerClone;
  }
}

class Neuron {
  constructor(inputSize, dontInit = false) {
    if (!dontInit) {
      this.weights = Vectorary.zeroes(inputSize);
      for (let i = 0; i < inputSize; i++) {
        this.weights[i] += (Math.random() * 2.0) - 1.0;
      }
      this.bias = (Math.random() * 2.0) - 1.0;
    }
  }

  setLinearActivation(isLinear) {
    this.isLinear = isLinear;
  }

  process(inputArray) {
    if (inputArray.length !== this.weights.length) {
      throw new Error("wrong input size");
    }
    this.z = Vectorary.dot(inputArray, this.weights) + this.bias;
    if (this.isLinear) {
      this.a = this.z;
      this.dz = 1.0;
    } else {
      this.a = this.tanh(this.z);
      this.dz = this.dtanh(this.z);
    }
    return this.a;
  }

  backward(rightDeltaArray, rightWeights) {
    this.delta = Vectorary.dot(rightDeltaArray, rightWeights) * this.dz;
    return this.delta;
  }

  update(alpha, leftAArray) {
    const ad = Vectorary.scale(this.delta, leftAArray);
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

  lerp(towardNeuron, tau) {
    this.bias = (tau * towardNeuron.bias) + ((1.0 - tau) * this.bias);
    for (let w = 0; w < this.weights.length; w++) {
      this.weights[w] = (tau * towardNeuron.weights[w]) + ((1.0 - tau) * this.weights[w]);
    }
  }

  clone() {
    const neuronClone = new Neuron(0, true);
    neuronClone.weights = this.weights.slice();
    neuronClone.bias = this.bias;
    neuronClone.isLinear = this.isLinear;
    return neuronClone;
  }
}

export default NeuralNetwork;
