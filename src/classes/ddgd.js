import NeuralNetwork from "./neural-network";
import Vectorary from "./vectorary";

class Ddgd {
  /*constructor params:
   *    getInitialState() returns state
   *    doAction(state, action) returns [reward, nextState]
   */
  constructor(ddgdBuilder) {
    this.critic = new NeuralNetwork(ddgdBuilder.criticLayout);
    this.targetCritic = this.critic.clone();
    this.actor = new NeuralNetwork(ddgdBuilder.actorLayout);
    this.targetActor = this.actor.clone();
    this.getInitialStateFunc = ddgdBuilder.getInitialStateFunc;
    this.doActionFunc = ddgdBuilder.doActionFunc;
    this.actionDimension = ddgdBuilder.actorLayout[ddgdBuilder.actorLayout.length - 1];
    this.criticActionIndices = [...Array(this.actionDimension).keys()]; //[0, 1, .., actionDimension]
    this.replayBuffer = new ReplayBuffer(ddgdBuilder.replayMaxLength);
    this.minibatchesSize = ddgdBuilder.minibatchesSize;
    this.gamma = ddgdBuilder.gamma;
    this.alpha = ddgdBuilder.alpha;
    this.tau = ddgdBuilder.tau;
  }

  initializeExhibition() {
    this.exhibitState = this.getInitialStateFunc();
  }

  step() {
    const tmp = this.doActionFunc(this.exhibitState, this.actor.process(this.exhibitState));
    const nextState = tmp[1];
    this.exhibitState = nextState;
  }
  
  onTimeStep(callback) {
    this.onTimeStep = callback;
  }

  onExploreRep(callback) {
    this.onExploreRep = callback;
  }

  learn(length, exploreRep) {
    const noise = new OUNoise(0.15, 0.3, this.actionDimension);
    noise.reset();
    let currentState = this.getInitialStateFunc();
    for (let t = 0; t < length; t++) {
      this.explore(currentState, exploreRep, noise);
      this.update();
      const action = this.actor.process(currentState);
      const tmp = this.doActionFunc(currentState, action);
      const reward = tmp[0];
      const nextState = tmp[1];
      if (reward === 500.0) {
        currentState = this.getInitialStateFunc();
      } else {
        currentState = nextState;
      }
      this.onTimeStep();
    }
  }

  update() {
    const minibatches = this.replayBuffer.sample(this.minibatchSize);
    minibatches.forEach(minibatch => {
      const state = minibatch[0];
      const action = minibatch[1];
      const reward = minibatch[2];
      const nextState = minibatch[3];
      const targetActorNextAction = this.targetActor.process(nextState);
      const nextTargetQ = this.targetCritic.process([...targetActorNextAction, ...nextState]);
      const y = reward + (this.gamma * nextTargetQ);
      const q = this.critic.process([action, ...state]);
      this.critic.learn(this.alpha, q - y);
      const newAction = this.actor.process(state);
      const qWrtA = this.critic.gradientWrtNthInputAtState(this.criticActionIndices, [...newAction, ...state]);
      this.actor.learn(this.alpha, [qWrtA]);
    });
    this.targetActor.lerp(this.actor, this.tau);
    this.targetCritic.lerp(this.critic, this.tau);
  }

  explore(fromState, rep, noise) {
    const policyAction = this.actor.process(fromState);
    for (let i = 0; i < rep; i++) {
      const dAction = noise.nextValue();
      const tryAction = Vectorary.add(policyAction, dAction);
      const tmp = this.doActionFunc(fromState, tryAction);
      const reward = tmp[0];
      const nextState = tmp[1];
      this.replayBuffer.push(fromState, tryAction, reward, nextState);
      this.onExploreRep();
    }
  }
}

class ReplayBuffer {
  constructor(maxLength) {
    this.buffer = [];
    this.maxLength = maxLength;
    this.isFull = false;
  }

  push(state, action, reward, nextState) {
    this.buffer.push([state, action, reward, nextState]);
    if (!this.isFull) {
      if (this.buffer.length === this.maxLength) {
        this.isFull = true;
      }
    } else {
      this.buffer.shift();
    }
  }

  sample(size) {
    const samples = [];
    for (let i = 0; i < size; i++) {
      const index = Math.floor(Math.random() * this.buffer.length);
      samples.push(this.buffer[index]);
    }
    return samples;
  }
}

class OUNoise {
  constructor(theta = 0.15, sigma = 0.3, dimensionCount = 1) {
    this.dimensionCount = dimensionCount;
    this.theta = theta;
    this.sigma = sigma;
    this.reset();
  }

  reset() {
    this.state = Vectorary.zeroes(this.dimensionCount);
  }

  walk() {
    const dstate = Vectorary.add(Vectorary.scale(-this.theta, this.state), Vectorary.scale(this.sigma, RandomGen.normalUnitCombination(this.dimensionCount)));
    this.state = Vectorary.add(this.state, dstate);
  }

  nextValue() {
    this.walk();
    return this.state;
  }
}

class DdgdBuilder {
  setCriticLayout(value) {
    this.criticLayout = value;
  }

  setActorLayout(value) {
    this.actorLayout = value;
  }

  setGetInitialStateFunc(value) {
    this.getInitialStateFunc = value;
  }

  setDoActionFunc(value) {
    this.doActionFunc = value;
  }

  setReplayMaxLength(value) {
    this.replayMaxLength = value;
  }

  setMiniBatchesSize(value) {
    this.minibatchesSize = value;
  }

  setGamma(value) {
    this.gamma = value;
  }

  setAlpha(value) {
    this.alpha = value;
  }

  setTau(value) {
    this.tau = value;
  }

  build() {
    return new Ddgd(this);
  }
}

class RandomGen {
  static normalUnit() {
    return Math.pow(-2.0 * (Math.log(Math.random)), 0.5);
  }

  static normalUnitCombination(dimensionCount) {
    const R = RandomGen.normalUnit();
    const acc = [R];
    for (let i = 1; i < dimensionCount; i++) {
      const newTheta = 2.0 * Math.PI * Math.random;
      acc.push(R * Math.cos(newTheta));
      for (let j = 0; j < i; j++) {
        acc[j] *= Math.sin(newTheta);
      }
    }
    return acc;
  }
}

export default DdgdBuilder;
