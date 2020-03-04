import GravitySimulation from "./gravity-simulation";

class Simulator {
  constructor() {
    this.a = {
      position: [1000.0, 1000.0],
      velocity: [6.0, -6.0],
      radius: Math.pow(1000000.0 * 5.0, 1/3),
      mass: 1000.0
    }
    this.b = {
      position: [0.0, 0.0],
      velocity: [0.0, 0.0],
      radius: Math.pow(10000000.0 * 5.0, 1/3),
      mass: 100000.0
    }
    this.c = {
      position: [300.0, 300.0],
      velocity: [11.0, -11.0],
      radius: Math.pow(0.001 * 5.0, 1/3),
      mass: 0.001,
      fuel: 100.0,
      magicAccelerationMagnitude: 0.1
    }
    this.timestep = 0.5;
    this.sim = new GravitySimulator(new DefaultMathFunction());
    this.sim.addBody(this.a);
    this.sim.addBody(this.b);
    this.sim.addBody(this.c);
  }

  stepSimulation() {
    this.sim.updateTime(this.timestep);
    this.sim.detectCollision(this.c);
  }

}

export default Simulator;
