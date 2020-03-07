import GravitySimulation from "./gravity-simulation";

class Simulator {
  constructor() {
    this.a = {
      position: [1000.0, 1000.0],
      velocity: [6.0, -6.0],
      radius: Simulator.massToRadius(1000.0),
      mass: 1000.0
    }
    this.b = {
      position: [0.0, 0.0],
      velocity: [0.0, 0.0],
      radius: Simulator.massToRadius(100000.0),
      mass: 100000.0
    }
    this.c = {
      position: [300.0, 300.0],
      velocity: [11.0, -11.0],
      radius: Simulator.massToRadius(0.001),
      mass: 0.001,
      fuel: 100.0,
      isMagicEnabled: false,
      magicAccelerationDirection: [0.0, 0.0],
      magicAccelerationMagnitude: 0.1
    }
    this.timestep = 5.0;
    this.sim = new GravitySimulation();
    this.sim.addBody(this.a);
    this.sim.addBody(this.b);
    this.sim.addBody(this.c);
  }

  getInitialState() {
    this.a.position = [1000.0, 1000.0];
    this.a.velocity = [6.0, -6.0];
    this.a.radius = Simulator.massToRadius(1000.0);
    this.a.mass = 1000.0;
    this.b.position = [0.0, 0.0];
    this.b.velocity = [0.0, 0.0];
    this.b.radius = Simulator.massToRadius(100000.0);
    this.b.mass = 100000.0;
    this.c.position = [300.0, 300.0];
    this.c.velocity = [11.0, -11.0];
    this.c.radius = Simulator.massToRadius(0.001);
    this.c.mass = 0.001;
    this.c.fuel = 100.0;
    this.c.magicAccelerationMagnitude = 0.1;
    return this.getState();
  }

  stepSimulation() {
    this.sim.updateTime(this.timestep);
    this.isColliding = this.sim.detectCollision(this.c);
  }

  doAction(state, action) {
    this.setState(state);
    const isPropulsing = action[0] > 0;
    const propulsionX = action[1];
    const propulsionY = action[2];
    this.c.magicAccelerationDirection = [propulsionX, propulsionY];
    this.c.isMagicEnabled = isPropulsing;
    this.stepSimulation();
    let reward = 0.0;
    if (this.isColliding) {
      reward = -5000000000.0;
    } else {
      const dVX = this.b.velocity[0] - this.c.velocity[0];
      const dVY = this.b.velocity[1] - this.c.velocity[1];
      const cToBX = this.b.position[0] - this.c.position[0];
      const cToBY = this.b.position[1] - this.c.position[1];
      const vAway = (cToBX * dVX) + (cToBY * dVY);
      reward = vAway;
    }
    const nextState = this.getState();
    return [reward, nextState];
  }

  getState() {
    const aX = Simulator.simSpaceToNnSpace(this.a.position[0] - this.c.position[0]);
    const aY = Simulator.simSpaceToNnSpace(this.a.position[1] - this.c.position[1]);
    const aVX = Simulator.simSpaceToNnSpace(this.a.velocity[0] - this.c.velocity[0]);
    const aVY = Simulator.simSpaceToNnSpace(this.a.velocity[1] - this.c.velocity[1]);
    const aR = Simulator.simSpaceToNnSpace(this.a.radius);
    const bX = Simulator.simSpaceToNnSpace(this.b.position[0] - this.c.position[0]);
    const bY = Simulator.simSpaceToNnSpace(this.b.position[1] - this.c.position[1]);
    const bVX = Simulator.simSpaceToNnSpace(this.b.velocity[0] - this.c.velocity[0]);
    const bVY = Simulator.simSpaceToNnSpace(this.b.velocity[1] - this.c.velocity[1]);
    const bR = Simulator.simSpaceToNnSpace(this.b.radius);
    const fuel = this.c.fuel / 100.0;
    return [aX, aY, aVX, aVY, aR, bX, bY, bVX, bVY, bR, fuel];
  }

  setState(state) {
    const aX = state[0];
    const aY = state[1];
    const aVX = state[2];
    const aVY = state[3];
    const aR = state[4];
    const bX = state[5];
    const bY = state[6];
    const bVX = state[7];
    const bVY = state[8];
    const bR = state[9];
    const fuel = state[10];
    this.a.position[0] = Simulator.nnSpaceToSimSpace(aX);
    this.a.position[1] = Simulator.nnSpaceToSimSpace(aY);
    this.a.velocity[0] = Simulator.nnSpaceToSimSpace(aVX);
    this.a.velocity[1] = Simulator.nnSpaceToSimSpace(aVY);
    this.a.radius = Simulator.nnSpaceToSimSpace(aR);
    this.a.mass = Simulator.radiusToMass(this.a.radius);
    this.b.position[0] = Simulator.nnSpaceToSimSpace(bX);
    this.b.position[1] = Simulator.nnSpaceToSimSpace(bY);
    this.b.velocity[0] = Simulator.nnSpaceToSimSpace(bVX);
    this.b.velocity[1] = Simulator.nnSpaceToSimSpace(bVY);
    this.b.radius = Simulator.nnSpaceToSimSpace(bR);
    this.b.mass = Simulator.radiusToMass(this.b.radius);
    this.c.fuel = fuel * 100.0;
    this.c.position = [0.0, 0.0];
    this.c.velocity = [0.0, 0.0];
  }

  static massToRadius(value) {
    return Math.pow(value * 500.0, 1/3);
  }

  static radiusToMass(value) {
    return Math.pow(value, 3) / 500.0;
  }

  static simSpaceToNnSpace(value) {
    return value / 1000.0;
  }

  static nnSpaceToSimSpace(value) {
    return value * 1000.0;
  }
}

export default Simulator;
