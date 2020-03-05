class DDGD {
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
    const actionDimension = ddgdBuilder.actorLayout[ddgdBuilder.actorLayout.length - 1];
    this.replayBuffer = new ReplayBuffer(ddgdBuilder.replayMaxLength);
  }

  learn(length, exploreRep) {
    const actionDimension = ddgdBuilder.actorLayout[ddgdBuilder.actorLayout.length - 1];
    const noise = new OUNoise(0.15, 0.3, actionDimension);
    noise.reset();
    let currentState = this.getInitialStateFunc();
    for (let t = 0; t < length; t++) {
      explore(currentState, exploreRep, noise);
      this.update();
      currentState = this.actor.process(currentState);
    }
  }

  update() {
  }

  explore(fromState, rep, noise) {
    const policyAction = this.actor.process(fromState);
    for (let i = 0; i < rep; i++) {
      const dAction = noise.nextValue();
      const tryAction = Vectorary.add(policyAction, dAction);
      reward, nextState = this.doActionFunc(fromState, tryAction);
      this.replayBuffer.push(fromState, tryAction, reward, nextState);
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
      if (this.buffer.length === maxLength) {
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

  getNextValue() {
    this.walk();
    return this.state;
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

export default DDGD;
