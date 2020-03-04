class DDGD {
  /*constructor params:
   *    getInitialState() returns (state)
   *    doAction(state, action) returns (nextState, reward)
   */
  constructor(ddgdBuilder) {
    this.critic = new NeuralNetwork();
    this.targetCritic = new NeuralNetwork();
    this.actor = new NeuralNetwork();
    this.targetActor = new NeuralNetwork();
  }
}

export default DDGD;
