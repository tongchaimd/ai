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
      });
    }
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
