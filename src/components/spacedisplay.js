import React from "react";

class SpaceDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.width = 1300;
    this.centerX = this.width / 2;
    this.height = 600;
    this.centerY = this.height / 2;
    this.antiMag = 1.5;
    this.scale = 500.0 / Math.pow(this.antiMag, 6);
    this.context = undefined;
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext("2d");
    this.renderCanvas();

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      this.antiMag += e.deltaY * 0.02;
      if (this.antiMag < 1.0) this.antiMag = 1.0;
      this.scale = 500.0 / Math.pow(this.antiMag, 6);
    });
  }

  componentDidUpdate(prevProps) {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext("2d");
    this.renderCanvas();
  }

  renderCanvas() {
    this.cleanCanvas();
    this.fillBackground();
    if (this.props.circles) {
      this.props.circles.forEach((circle) => {
        this.drawCircle(circle.position, circle.radius, this.props.focusedOnCircle.position);
        if (circle.isMagicEnabled && circle.fuel > 0) {
          const aX = circle.magicAccelerationDirection[0];
          const aY = circle.magicAccelerationDirection[1];
          const aLength = Math.pow(aX * aX + aY * aY, 1/2);
          this.drawArrow(Math.atan2(aY, aX), [(aX / aLength) * 100.0, (-aY / aLength) * 100.0]);
        }
      });
    }
    this.drawReward();
    if (this.props.fuelPercentage) {
      this.drawFuel(this.props.fuelPercentage);
    }
  }

  fillBackground() {
    this.context.fillStyle = '#16122b';
    this.context.fillRect(0, 0, this.width, this.height);
    this.resetContext();
  }

  drawFuel(percentage) {
    this.context.lineWidth = 3.0;
    this.context.strokeRect(50, 50, 20, 100);
    this.context.fillRect(50, 150, 20, -percentage);
    this.resetContext();
  }

  drawCircle(center, radius, offset) {
    this.context.beginPath();
    this.context.arc(((center[0] - offset[0]) * this.scale) + this.centerX, (-(center[1] - offset[1]) * this.scale) + this.centerY, radius * this.scale, 0, 2 * Math.PI);
    this.context.stroke();
  }

  drawArrow(rotate, offset) {
    const points = [
      [-50, -10],
      [0, -10],
      [0, -30],
      [20, 0],
      [0, 30],
      [0, 10],
      [-50, 10],
      [-50, -10]
    ];
    this.context.beginPath();
    const rotated0 = this.rotate(rotate, points[0]);
    this.context.moveTo(rotated0[0] + offset[0] + this.centerX, -rotated0[1] + offset[1] + this.centerY);
    for (let p = 1; p < points.length; p++) {
      const rotatedP = this.rotate(rotate, points[p]);
      this.context.lineTo(rotatedP[0] + offset[0] + this.centerX, -rotatedP[1] + offset[1] + this.centerY);
    }
    this.context.stroke();
  }

  rotate(theta, vector) {
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const newX = (vector[0] * cosT) - (vector[1] * sinT);
    const newY = (vector[0] * sinT) + (vector[1] * cosT);
    return [newX, newY];
  }

  drawReward() {
    this.context.font = '20px sans-serif';
    this.context.fillText("reward " + this.props.reward, 20, 500);
  }

  resetContext() {
    this.context.lineWidth = 2.0;
    this.context.strokeStyle = 'grey';
    this.context.fillStyle = 'grey';
    this.context.setLineDash([]);
  }

  cleanCanvas() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  render() {
    return (
      <canvas ref={this.canvasRef} height={this.height} width={this.width} style={{ border: `solid` }}>
      </canvas>
    )
  }
}

export default SpaceDisplay;
