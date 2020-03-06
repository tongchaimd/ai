import React from "react"
import Simulator from "../classes/simulator"
import DdgdBuilder from "../classes/ddgd"

class Ai extends React.Component {
  constructor(props) {
    super(props);
    const simulator = new Simulator();
    const ddgdBuilder = new DdgdBuilder();
    ddgdBuilder.setCriticLayout([14, 14, 14, 1])
    ddgdBuilder.setActorLayout([11, 11, 11, 3])
    ddgdBuilder.setGetInitialStateFunc(simulator.getInitialState)
    ddgdBuilder.setDoActionFunc(simulator.doAction)
    ddgdBuilder.setReplayMaxLength(100000)
    ddgdBuilder.setMiniBatchesSize(10)
    ddgdBuilder.setGamma(0.5)
    ddgdBuilder.setAlpha(0.01)
    ddgdBuilder.setTau(0.01)
    const ddgd = ddgdBuilder.build();
    console.log(ddgd);
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
