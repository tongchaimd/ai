import React from "react"

class Ai extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.width = 1300;
    this.height = 600;
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
    this.goalCircle = {
      position: [100.0, 100.0],
      radius: 2000.0
    }
    this.antiMag = 1.5;
    this.scale = 500.0 / Math.pow(this.antiMag, 6);
    this.timestep = 0.5;
    this.sim = new GravitySimulator(new DefaultMathFunction());
    this.sim.addBody(this.a);
    this.sim.addBody(this.b);
  }

  componentDidMount() {
    const realCanvas = this.canvas.current;
    const context = realCanvas.getContext("2d");
    this.renderCanvas(context);
    setInterval(this.renderCanvas.bind(this), 16, context);

    const rect = realCanvas.getBoundingClientRect();
    
    realCanvas.addEventListener('mousedown', e => {
      if (!this.hasGameStarted) {
        this.sim.addBody(this.c);
      }
      this.hasGameStarted = true;
      this.isMouseDown = true;
      const mouseCanvasX = e.clientX - rect.left;
      const mouseCanvasY = e.clientY - rect.top;
      const mouseCoordX = this.xDrawCoordToCoord(mouseCanvasX);
      const mouseCoordY = this.yDrawCoordToCoord(mouseCanvasY);
      this.c.magicAccelerationDirection = [];
      this.c.magicAccelerationDirection[0] = mouseCoordX - this.c.position[0];
      this.c.magicAccelerationDirection[1] = mouseCoordY - this.c.position[1];
    });

    realCanvas.addEventListener('mousemove', e => {
      if (this.isMouseDown) {
        const mouseCanvasX = e.clientX - rect.left;
        const mouseCanvasY = e.clientY - rect.top;
        const mouseCoordX = this.xDrawCoordToCoord(mouseCanvasX);
        const mouseCoordY = this.yDrawCoordToCoord(mouseCanvasY);
        this.c.magicAccelerationDirection = [];
        this.c.magicAccelerationDirection[0] = mouseCoordX - this.c.position[0];
        this.c.magicAccelerationDirection[1] = mouseCoordY - this.c.position[1];
      }
    });

    realCanvas.addEventListener('mouseup', e => {
      this.isMouseDown = false;
      this.c.magicAccelerationDirection = null;
    });

    realCanvas.addEventListener('wheel', e => {
      e.preventDefault();
      this.antiMag += e.deltaY * 0.02;
      if (this.antiMag < 1.0) this.antiMag = 1.0;
      this.scale = 500.0 / Math.pow(this.antiMag, 6);
    });
  }

  renderCanvas(context) {
    this.cleanCanvas(context);
    this.fillBackground(context);
    this.drawCircle(this.a.position, this.a.radius, context);
    this.drawCircle(this.b.position, this.b.radius, context);
    this.drawCircle(this.c.position, this.c.radius, context);
    this.drawGoalCircle(context);
    this.drawFuel(context);
    if (this.isMouseDown) {
      if (this.c.fuel > 0.0) {
        this.c.fuel = this.c.fuel - (1.0 * this.timestep);
        if (this.c.fuel < 0.0) {
          this.c.fuel = 0.0;
        }
      }
    }
    this.sim.updateTime(this.timestep);
    this.sim.detectCollision(this.c);
  }

  fillBackground(context) {
    context.fillStyle = '#16122b';
    context.fillRect(0, 0, this.width, this.height);
    this.resetContext(context);
  }

  drawFuel(context) {
    context.lineWidth = 3.0;
    context.strokeRect(50, 50, 20, 100);
    context.fillRect(50, 150, 20, -this.c.fuel);
    this.resetContext(context);
  }

  drawGoalCircle(context) {
    context.lineWidth = 1.2;
    context.strokeStyle = 'grey';
    context.setLineDash([3, 12]);
    if (!this.hasGameStarted) {
      this.goalCircle.position = this.c.position;
    }
    this.drawCircle(this.goalCircle.position, this.goalCircle.radius, context);
    this.resetContext(context);
  }

  drawCircle(center, radius, context) {
    context.beginPath();
    context.arc(this.xCoordToDrawCoord(center[0]), this.yCoordToDrawCoord(center[1]), radius * this.scale, 0, 2 * Math.PI);
    context.stroke();
  }

  resetContext(context) {
    context.lineWidth = 2.0;
    context.strokeStyle = 'grey';
    context.fillStyle = 'grey';
    context.setLineDash([]);
  }

  cleanCanvas(context) {
    context.clearRect(0, 0, this.width, this.height);
  }

  xCoordToDrawCoord(x) {
    return ((x - this.c.position[0]) * this.scale) + (this.width / 2);
  }
  
  yCoordToDrawCoord(y) {
    return (-(y - this.c.position[1]) * this.scale) + (this.height / 2);
  }


  xDrawCoordToCoord(x) {
    return ((x - (this.width / 2)) / this.scale) + this.c.position[0];
  }
  
  yDrawCoordToCoord(y) {
    return (-(y - (this.height / 2)) / this.scale) + this.c.position[1];
  }

  render() {
    return (
      <canvas ref={this.canvas} height={this.height} width={this.width} style={{ border: `solid` }}>
      </canvas>
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
