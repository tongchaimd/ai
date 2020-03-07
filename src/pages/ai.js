import React from "react"
import SpaceDisplay from "../components/spacedisplay";
import Simulator from "../classes/simulator"
import DdgdBuilder from "../classes/ddgd"

class Ai extends React.Component {
  constructor(props) {
    super(props);
    this.displayRef = React.createRef();
    this.simulator = new Simulator();
    const ddgdBuilder = new DdgdBuilder();
    ddgdBuilder.setCriticLayout([14, 14, 14, 1])
    ddgdBuilder.setActorLayout([11, 11, 11, 3])
    ddgdBuilder.setGetInitialStateFunc(this.simulator.getInitialState.bind(this.simulator))
    ddgdBuilder.setDoActionFunc(this.simulator.doAction.bind(this.simulator))
    ddgdBuilder.setReplayMaxLength(10000000)
    ddgdBuilder.setMiniBatchesSize(1000)
    ddgdBuilder.setGamma(0.5)
    ddgdBuilder.setAlpha(0.1)
    ddgdBuilder.setTau(0.01)
    this.ddgd = ddgdBuilder.build();

    this.lengthRef = React.createRef();
    this.explorationRef = React.createRef();

    this.state = {reward: 0.0};
  }

  componentDidMount() {
    let e = 0;
    let t = 0;
    this.ddgd.onTimeStep(() => {
      t++;
      e = 0;
      console.log("t " + t);
    });
    this.ddgd.onExploreRep(() => {
      e++;
      if (e % 500 === 0) {
        console.log("e " + e);
      }
    });
    this.ddgd.initializeExhibition();
    this.exhibitInterval = setInterval(this.step.bind(this), 100);
  }

  step() {
    const reward = this.ddgd.step();
    this.setState({reward: reward});
    this.forceUpdate();
  }

  train = () => {
    const length = this.lengthRef.current.value;
    const exploration = this.explorationRef.current.value;
    this.ddgd.learn(length, exploration);
    this.ddgd.initializeExhibition();
  }

  render() {
    return (
      <div>
        <SpaceDisplay ref={this.displayRef} circles={[this.simulator.a, this.simulator.b, this.simulator.c]} focusedOnCircle={this.simulator.c} fuelPercentage={this.simulator.c.fuel} reward={this.state.reward} />
        <div>
          <label>length
            <input type="text" defaultValue="500" ref={this.lengthRef}/>
          </label>
          <label>exploration
            <input type="text" defaultValue="100" ref={this.explorationRef} />
          </label>
          <input type="button" value="TRAIN" onClick={this.train} />
        </div>
      </div>
    )
  }
}

export default Ai
