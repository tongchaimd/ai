class DDGD {
  constructor(ddgdBuilder) {
    this.critic = new NeuralNetwork();
    this.targetCritic = new NeuralNetwork();
    this.actor = new NeuralNetwork();
    this.targetActor = new NeuralNetwork();
  }
}

export default DDGD;
