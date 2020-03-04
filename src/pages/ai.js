import React from "react"
import SpaceDisplay from "../components/spacedisplay"
import NeuralNetwork from "../classes/neural-network"

class Ai extends React.Component {
  constructor(props) {
    super(props);
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
    //const a = new NeuralNetwork([1, 3, 3, 1]);
    //for (let i = 0; i < 2000; i++) {
      //const expectation = Math.random();
      //const out = a.process([expectation * 100.0])[0];
      //console.log("expectation");
      //console.log(expectation);
      //console.log("out");
      //console.log(out);
      //a.learn(0.1, [out - expectation]);
      ////console.log("weights");
      ////console.log(a.layers[0].weights()[0][0]);
      ////console.log(a.layers[1].weights()[0][0]);
      ////console.log("biases");
      ////console.log(a.layers[0].neurons[0].bias);
      ////console.log(a.layers[1].neurons[0].bias);
    //}
  }

  componentDidMount() {
    setInterval(this.stepSimulation.bind(this), 16);
  }

  stepSimulation() {
    this.sim.updateTime(this.timestep);
    this.sim.detectCollision(this.c);
    this.forceUpdate();
  }

  render() {
    return (
      <SpaceDisplay circles={[this.a, this.b, this.c]} focusedOnCircle={this.c} fuelPercentage={this.c.fuel} />
    )
  }
}

export default Ai

class GravitySimulator {

  constructor(mf) {
    this.mf = mf;
    this.bodies = [];
    this.GRAVITY_CONSTANT = 1; // Nm2/kg2
  }

  addBody(body) {
    this.bodies.push(body);
  };	

  removeBody(body) {
    const index = this.bodies.indexOf(body);
    this.bodies.splice(index, 1);
  };

  calcAccelFromPos(G, M, R1, R2) {
    const dR = this.mf.sub(R1, R2);
    const RDiffMag = Math.sqrt(this.mf.lengthSquared(dR));
    if(RDiffMag === 0.0) {
      return this.mf.nullVector();
    }
    const D = G * M / (RDiffMag * RDiffMag * RDiffMag);
    return this.mf.mulScalar(dR, D);
  };

  calcAccelForObject(body, G, R) {
    let accel = this.mf.nullVector();

    // add acceleration from booster
    if (body.magicAccelerationDirection && body.fuel > 0.0) {
      const magicAcceleration = this.mf.mulScalar(this.mf.normalize(body.magicAccelerationDirection), body.magicAccelerationMagnitude);
      accel = this.mf.add(accel, magicAcceleration);
    }

    this.bodies.forEach((otherBody) => {
      if(otherBody === body)
        return;
      accel = this.mf.add(accel, this.calcAccelFromPos(G, otherBody.mass, otherBody.position, R));
    });
    return accel;
  };

  multiAdd() {
    let r = this.mf.nullVector();
    for(let i=0;i<arguments.length;i++) {
      r = this.mf.add(r, arguments[i]);
    }
    return r;
  };

  updateTime(dt) {
    this.bodies.forEach((otherBody) => {
      // Integrate via Runge-Kutta...
      let R = otherBody.position;
      let V = otherBody.velocity;
      const A = this.calcAccelForObject(otherBody, this.GRAVITY_CONSTANT, R);

      const halfDiffT = 0.5 * dt;

      const KaV = V;
      const KaA = A;

      const KbR = this.mf.add(R, this.mf.mulScalar(KaV, halfDiffT));
      const KbV = this.mf.add(V, this.mf.mulScalar(KaA, halfDiffT));
      const KbA = this.calcAccelForObject(otherBody, this.GRAVITY_CONSTANT, KbR);

      const KcR = this.mf.add(R, this.mf.mulScalar(KbV, halfDiffT));
      const KcV = this.mf.add(V, this.mf.mulScalar(KbA, halfDiffT));
      const KcA = this.calcAccelForObject(otherBody, this.GRAVITY_CONSTANT, KcR);

      const KdR = this.mf.add(R, this.mf.mulScalar(KcV, dt));
      const KdV = this.mf.add(V, this.mf.mulScalar(KcA, dt));
      const KdA = this.calcAccelForObject(otherBody, this.GRAVITY_CONSTANT, KdR);

      const vfV = this.mf.mulScalar(this.multiAdd(KaV, this.mf.mulScalar(KbV, 2.0), this.mf.mulScalar(KcV, 2.0), KdV), 1.0/6.0);
      const vfA = this.mf.mulScalar(this.multiAdd(KaA, this.mf.mulScalar(KbA, 2.0), this.mf.mulScalar(KcA, 2.0), KdA), 1.0/6.0);

      R = this.mf.add(R, this.mf.mulScalar(vfV, dt));
      V = this.mf.add(V, this.mf.mulScalar(vfA, dt));

      otherBody.position = R;
      otherBody.velocity = V;
    });
  };

  detectCollision(body) {
    // if exists colliding body ∈ bodies
    return this.bodies.some((otherBody) => {
      if(otherBody === body) {
        return false;
      }

      // check if d^2 > r^3 + R^3 -> d > r + R -> not colliding
      const dVector = this.mf.sub(otherBody.position, body.position);
      const dSquared = this.mf.lengthSquared(dVector);
      const sumOfRadiiCubed = body.mass + otherBody.mass;
      if (dSquared > sumOfRadiiCubed) return false;

      // check if d^2 < r + R -> d < r + R -> colliding
      const sumOfRadii = body.radius + otherBody.radius;
      if (dSquared < sumOfRadii) return true;

      // check if d < r + R -> colliding
      const d = Math.pow(dSquared, 1/2);
      if (d < sumOfRadii) return true;

      return false;
    });
  }
}

class DefaultMathFunction {
  nullVector() {
    return [0,0];
  }

  add(a, b) {
    return [
      a[0] + b[0],
      a[1] + b[1]
    ];
  }

  sub(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1]
    ];
  }

  mulScalar(a, s) {
    return [
      a[0] * s,
      a[1] * s
    ];
  }

  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  lengthSquared(a) {
    return a[0]*a[0] + a[1]*a[1];
  }

  length(a) {
    return Math.pow(this.lengthSquared(a), 1/2);
  }

  normalize(a) {
    return this.mulScalar(a, 1 / this.length(a));
  }
}