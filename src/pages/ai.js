import React from "react"
import SpaceDisplay from "../components/spacedisplay"
import NeuralNetwork from "../classes/neural-network"
import Simulator from "../classes/simulator"

class Ai extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      //<SpaceDisplay circles={[this.a, this.b, this.c]} focusedOnCircle={this.c} fuelPercentage={this.c.fuel} />
      <div></div>
    )
  }
}

export default Ai
