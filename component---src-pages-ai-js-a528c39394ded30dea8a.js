(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{OGtf:function(t,i,e){var n=e("XKFU"),s=e("eeVq"),a=e("vhPU"),r=/"/g,o=function(t,i,e,n){var s=String(a(t)),o="<"+i;return""!==e&&(o+=" "+e+'="'+String(n).replace(r,"&quot;")+'"'),o+">"+s+"</"+i+">"};t.exports=function(t,i){var e={};e[t]=i(o),n(n.P+n.F*s((function(){var i=""[t]('"');return i!==i.toLowerCase()||i.split('"').length>3})),"String",e)}},Zz4T:function(t,i,e){"use strict";e("OGtf")("sub",(function(t){return function(){return t(this,"sub","","")}}))},pUKO:function(t,i,e){"use strict";e.r(i);var n=e("q1tI"),s=e.n(n);var a=function(t){var i,e;function n(i){var e;return(e=t.call(this,i)||this).canvasRef=s.a.createRef(),e.width=1300,e.centerX=e.width/2,e.height=600,e.centerY=e.height/2,e.antiMag=3,e.scale=500/Math.pow(e.antiMag,6),e.context=void 0,e}e=t,(i=n).prototype=Object.create(e.prototype),i.prototype.constructor=i,i.__proto__=e;var a=n.prototype;return a.componentDidMount=function(){var t=this;this.canvas=this.canvasRef.current,this.context=this.canvas.getContext("2d"),this.renderCanvas(),this.canvas.addEventListener("wheel",(function(i){i.preventDefault(),t.antiMag+=.02*i.deltaY,t.antiMag<1&&(t.antiMag=1),t.scale=500/Math.pow(t.antiMag,6)}))},a.componentDidUpdate=function(t){this.canvas=this.canvasRef.current,this.context=this.canvas.getContext("2d"),this.renderCanvas()},a.renderCanvas=function(){var t=this;this.cleanCanvas(),this.fillBackground(),this.props.circles&&this.props.circles.forEach((function(i){if(t.drawCircle(i.position,i.radius,t.props.focusedOnCircle.position),i.isMagicEnabled&&i.fuel>0){var e=i.magicAccelerationDirection[0],n=i.magicAccelerationDirection[1],s=Math.pow(e*e+n*n,.5);t.drawArrow(Math.atan2(n,e),[e/s*100,-n/s*100])}})),this.drawReward(),this.props.fuelPercentage&&this.drawFuel(this.props.fuelPercentage)},a.fillBackground=function(){this.context.fillStyle="#16122b",this.context.fillRect(0,0,this.width,this.height),this.resetContext()},a.drawFuel=function(t){this.context.lineWidth=3,this.context.strokeRect(50,50,20,100),this.context.fillRect(50,150,20,-t),this.resetContext()},a.drawCircle=function(t,i,e){this.context.beginPath(),this.context.arc((t[0]-e[0])*this.scale+this.centerX,-(t[1]-e[1])*this.scale+this.centerY,i*this.scale,0,2*Math.PI),this.context.stroke()},a.drawArrow=function(t,i){var e=[[-50,-10],[0,-10],[0,-30],[20,0],[0,30],[0,10],[-50,10],[-50,-10]];this.context.beginPath();var n=this.rotate(t,e[0]);this.context.moveTo(n[0]+i[0]+this.centerX,-n[1]+i[1]+this.centerY);for(var s=1;s<e.length;s++){var a=this.rotate(t,e[s]);this.context.lineTo(a[0]+i[0]+this.centerX,-a[1]+i[1]+this.centerY)}this.context.stroke()},a.rotate=function(t,i){var e=Math.sin(t),n=Math.cos(t);return[i[0]*n-i[1]*e,i[0]*e+i[1]*n]},a.drawReward=function(){this.context.font="20px sans-serif",this.context.fillText("reward "+Math.round(this.props.reward),20,500)},a.resetContext=function(){this.context.lineWidth=2,this.context.strokeStyle="grey",this.context.fillStyle="grey",this.context.setLineDash([])},a.cleanCanvas=function(){this.context.clearRect(0,0,this.width,this.height)},a.render=function(){return s.a.createElement("canvas",{ref:this.canvasRef,height:this.height,width:this.width,style:{border:"solid"}})},n}(s.a.Component),r=(e("Zz4T"),function(){function t(t){void 0===t&&(t=new o),this.mf=t,this.bodies=[],this.GRAVITY_CONSTANT=1}var i=t.prototype;return i.addBody=function(t){this.bodies.push(t)},i.removeBody=function(t){var i=this.bodies.indexOf(t);this.bodies.splice(i,1)},i.calcAccelFromPos=function(t,i,e,n){var s=this.mf.sub(e,n),a=Math.sqrt(this.mf.lengthSquared(s));if(0===a)return this.mf.nullVector();var r=t*i/(a*a*a);return this.mf.mulScalar(s,r)},i.calcAccelForObject=function(t,i,e){var n=this,s=this.mf.nullVector();if(t.isMagicEnabled&&t.fuel>0){var a=this.mf.mulScalar(this.mf.normalize(t.magicAccelerationDirection),t.magicAccelerationMagnitude);s=this.mf.add(s,a)}return this.bodies.forEach((function(a){a!==t&&(s=n.mf.add(s,n.calcAccelFromPos(i,a.mass,a.position,e)))})),s},i.multiAdd=function(){for(var t=this.mf.nullVector(),i=0;i<arguments.length;i++)t=this.mf.add(t,arguments[i]);return t},i.updateTime=function(t){var i=this;this.bodies.forEach((function(e){e.isMagicEnabled&&e.fuel>0&&(e.fuel-=t,e.fuel<0&&(e.fuel=0));var n=e.position,s=e.velocity,a=i.calcAccelForObject(e,i.GRAVITY_CONSTANT,n),r=.5*t,o=s,c=a,h=i.mf.add(n,i.mf.mulScalar(o,r)),u=i.mf.add(s,i.mf.mulScalar(c,r)),l=i.calcAccelForObject(e,i.GRAVITY_CONSTANT,h),f=i.mf.add(n,i.mf.mulScalar(u,r)),p=i.mf.add(s,i.mf.mulScalar(l,r)),d=i.calcAccelForObject(e,i.GRAVITY_CONSTANT,f),m=i.mf.add(n,i.mf.mulScalar(p,t)),v=i.mf.add(s,i.mf.mulScalar(d,t)),g=i.calcAccelForObject(e,i.GRAVITY_CONSTANT,m),y=i.mf.mulScalar(i.multiAdd(o,i.mf.mulScalar(u,2),i.mf.mulScalar(p,2),v),1/6),S=i.mf.mulScalar(i.multiAdd(c,i.mf.mulScalar(l,2),i.mf.mulScalar(d,2),g),1/6);n=i.mf.add(n,i.mf.mulScalar(y,t)),s=i.mf.add(s,i.mf.mulScalar(S,t)),e.position=n,e.velocity=s}))},i.detectCollision=function(t){var i=this;return this.bodies.some((function(e){if(e===t)return!1;var n=i.mf.sub(e.position,t.position),s=i.mf.lengthSquared(n),a=t.radius+e.radius;return Math.pow(s,.5)<a}))},t}()),o=function(){function t(){}var i=t.prototype;return i.nullVector=function(){return[0,0]},i.add=function(t,i){return[t[0]+i[0],t[1]+i[1]]},i.sub=function(t,i){return[t[0]-i[0],t[1]-i[1]]},i.mulScalar=function(t,i){return[t[0]*i,t[1]*i]},i.dot=function(t,i){return t[0]*i[0]+t[1]*i[1]},i.lengthSquared=function(t){return t[0]*t[0]+t[1]*t[1]},i.length=function(t){return Math.pow(this.lengthSquared(t),.5)},i.normalize=function(t){return this.mulScalar(t,1/this.length(t))},t}(),c=r,h=function(){function t(){this.a={position:[1e3,1e3],velocity:[6,-6],radius:t.massToRadius(1e3),mass:1e3},this.b={position:[0,0],velocity:[0,0],radius:t.massToRadius(1e5),mass:1e5},this.c={position:[300,300],velocity:[11,-11],radius:t.massToRadius(.001),mass:.001,fuel:100,isMagicEnabled:!1,magicAccelerationDirection:[0,0],magicAccelerationMagnitude:.1},this.timestep=.2,this.sim=new c,this.sim.addBody(this.a),this.sim.addBody(this.b),this.sim.addBody(this.c)}var i=t.prototype;return i.getInitialState=function(){return this.a.position=[1e3,1e3],this.a.velocity=[6,-6],this.a.radius=t.massToRadius(1e3),this.a.mass=1e3,this.b.position=[0,0],this.b.velocity=[0,0],this.b.radius=t.massToRadius(1e5),this.b.mass=1e5,this.c.position=[300,300],this.c.velocity=[11,-11],this.c.radius=t.massToRadius(.001),this.c.mass=.001,this.c.fuel=100,this.c.magicAccelerationMagnitude=.1,this.getState()},i.stepSimulation=function(){this.sim.updateTime(this.timestep),this.isColliding=this.sim.detectCollision(this.c)},i.doAction=function(t,i){this.setState(t);var e=i[0]>0,n=i[1],s=i[2];this.c.magicAccelerationDirection=[n,s],this.c.isMagicEnabled=e,this.stepSimulation();var a=0;if(this.isColliding)a=-5e9;else{var r=this.b.velocity[0]-this.c.velocity[0],o=this.b.velocity[1]-this.c.velocity[1];a=(this.b.position[0]-this.c.position[0])*r+(this.b.position[1]-this.c.position[1])*o}return[a,this.getState()]},i.getState=function(){return[t.simSpaceToNnSpace(this.a.position[0]-this.c.position[0]),t.simSpaceToNnSpace(this.a.position[1]-this.c.position[1]),t.simSpaceToNnSpace(this.a.velocity[0]-this.c.velocity[0]),t.simSpaceToNnSpace(this.a.velocity[1]-this.c.velocity[1]),t.simSpaceToNnSpace(this.a.radius),t.simSpaceToNnSpace(this.b.position[0]-this.c.position[0]),t.simSpaceToNnSpace(this.b.position[1]-this.c.position[1]),t.simSpaceToNnSpace(this.b.velocity[0]-this.c.velocity[0]),t.simSpaceToNnSpace(this.b.velocity[1]-this.c.velocity[1]),t.simSpaceToNnSpace(this.b.radius),this.c.fuel/100]},i.setState=function(i){var e=i[0],n=i[1],s=i[2],a=i[3],r=i[4],o=i[5],c=i[6],h=i[7],u=i[8],l=i[9],f=i[10];this.a.position[0]=t.nnSpaceToSimSpace(e),this.a.position[1]=t.nnSpaceToSimSpace(n),this.a.velocity[0]=t.nnSpaceToSimSpace(s),this.a.velocity[1]=t.nnSpaceToSimSpace(a),this.a.radius=t.nnSpaceToSimSpace(r),this.a.mass=t.radiusToMass(this.a.radius),this.b.position[0]=t.nnSpaceToSimSpace(o),this.b.position[1]=t.nnSpaceToSimSpace(c),this.b.velocity[0]=t.nnSpaceToSimSpace(h),this.b.velocity[1]=t.nnSpaceToSimSpace(u),this.b.radius=t.nnSpaceToSimSpace(l),this.b.mass=t.radiusToMass(this.b.radius),this.c.fuel=100*f,this.c.position=[0,0],this.c.velocity=[0,0]},t.massToRadius=function(t){return Math.pow(500*t,1/3)},t.radiusToMass=function(t){return Math.pow(t,3)/500},t.simSpaceToNnSpace=function(t){return t/1e3},t.nnSpaceToSimSpace=function(t){return 1e3*t},t}(),u=(e("XfO3"),e("HEwt"),e("a1Th"),e("rE2o"),e("ioFf"),e("rGqo"),e("yt8O"),e("Btvt"),function(){function t(){}return t.dot=function(t,i){if(t.length!==i.length)throw new Error("unequal lengths");for(var e=0,n=0;n<t.length;n++)e+=t[n]*i[n];return e},t.scale=function(t,i){for(var e=i.slice(),n=0;n<e.length;n++)e[n]*=t;return e},t.add=function(t,i){if(t.length!==i.length)throw new Error("unequal lengths");for(var e=t.slice(),n=0;n<e.length;n++)e[n]+=i[n];return e},t.sub=function(t,i){if(t.length!==i.length)throw new Error("unequal lengths");for(var e=t.slice(),n=0;n<e.length;n++)e[n]-=i[n];return e},t.schur=function(t,i){if(t.length!==i.length)throw new Error("unequal lengths");for(var e=t.slice(),n=0;n<e.length;n++)e[n]*=i[n];return e},t.init=function(t,i){for(var e=[],n=0;n<t;n++)e.push(i);return e},t.zeroes=function(i){return t.init(i,0)},t.ones=function(i){return t.init(i,1)},t}()),l=function(){function t(t,i){if(void 0===i&&(i=!1),!i){this.layoutArray=t,this.layerCount=this.layoutArray.length-1,this.inputSize=this.layoutArray[0],this.outputSize=this.layoutArray[this.layerCount],this.layers=[];for(var e=0;e<this.layerCount;e++){var n=this.layoutArray[e];e<this.layerCount-1?this.layers.push(new f(n,this.layoutArray[e+1])):this.layers.push(new f(n,this.layoutArray[e+1],!0))}}}var i=t.prototype;return i.process=function(t){if(t.length!==this.inputSize)throw new Error("wrong input size");this.latestInputArray=t;for(var i=t.slice(),e=0;e<this.layerCount;e++)i=this.layers[e].process(i);return i},i.gradientWrtNthsInputAtState=function(t,i){if(1!==this.outputSize)throw new Error("gradientWrtNthInput function can only be used on 1 output network");this.process(i);for(var e=[1],n=this.layerCount-1;n>=0;n--)e=n===this.layerCount-1?this.layers[n].backward(e):this.layers[n].backward(e,this.layers[n+1].weights());return this.layers[0].weights().map((function(e){for(var n=[],s=0;s<t.length;s++)n.push(i[s]*e[s]);return n})).reduce((function(t,i){return u.add(t,i)}))},i.learn=function(t,i){for(var e=i,n=this.layerCount-1;n>=0;n--)e=n===this.layerCount-1?this.layers[n].backward(e):this.layers[n].backward(e,this.layers[n+1].weights());for(var s=this.latestInputArray,a=0;a<this.layerCount;a++)s=this.layers[a].update(t,s)},i.lerp=function(t,i){for(var e=0;e<this.layerCount;e++)this.layers[e].lerp(t.layers[e],i)},i.clone=function(){var i=new t(0,!0);return i.layers=this.layers.map((function(t){return t.clone()})),i.layoutArray=this.layoutArray,i.layerCount=this.layerCount,i.inputSize=this.inputSize,i.outputSize=this.outputSize,i},t}(),f=function(){function t(t,i,e,n){if(void 0===e&&(e=!1),void 0===n&&(n=!1),!n){this.neurons=[],this.isOutput=e;for(var s=0;s<i;s++){var a=new p(t);this.isOutput&&a.setLinearActivation(!1),this.neurons.push(a)}}}var i=t.prototype;return i.process=function(t){return this.neurons.map((function(i){return i.process(t)}))},i.backward=function(t,i){if(this.isOutput){for(var e=[],n=0;n<this.neurons.length;n++)this.neurons[n].delta=this.neurons[n].dz*t[n],e.push(this.neurons[n].delta);return e}return this.neurons.map((function(e,n){return e.backward(t,i.map((function(t){return t[n]})))}))},i.update=function(t,i){return this.neurons.map((function(e){return e.update(t,i)}))},i.weights=function(){return this.neurons.map((function(t){return t.weights}))},i.lerp=function(t,i){for(var e=0;e<this.neurons.length;e++)this.neurons[e].lerp(t.neurons[e],i)},i.clone=function(){var i=new t(0,0,0,!0);return i.neurons=this.neurons.map((function(t){return t.clone()})),i},t}(),p=function(){function t(t,i){if(void 0===i&&(i=!1),!i){this.weights=u.zeroes(t);for(var e=0;e<t;e++)this.weights[e]+=2*Math.random()-1;this.bias=2*Math.random()-1}}var i=t.prototype;return i.setLinearActivation=function(t){this.isLinear=t},i.process=function(t){if(t.length!==this.weights.length)throw new Error("wrong input size");return this.z=u.dot(t,this.weights)+this.bias,this.isLinear?(this.a=this.z,this.dz=1):(this.a=this.tanh(this.z),this.dz=this.dtanh(this.z)),this.a},i.backward=function(t,i){return this.delta=u.dot(t,i)*this.dz,this.delta},i.update=function(t,i){var e=u.scale(this.delta,i);return this.weights=u.sub(this.weights,u.scale(t,e)),this.bias=this.bias-t*this.delta,this.a},i.tanh=function(t){return 2/(1+Math.exp(-2*t))-1},i.dtanh=function(t){return 4/Math.pow(Math.exp(-t)+Math.exp(t),2)},i.lerp=function(t,i){this.bias=i*t.bias+(1-i)*this.bias;for(var e=0;e<this.weights.length;e++)this.weights[e]=i*t.weights[e]+(1-i)*this.weights[e]},i.clone=function(){var i=new t(0,!0);return i.weights=this.weights.slice(),i.bias=this.bias,i.isLinear=this.isLinear,i},t}(),d=l;function m(t){return function(t){if(Array.isArray(t)){for(var i=0,e=new Array(t.length);i<t.length;i++)e[i]=t[i];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var v=function(){function t(t){this.critic=new d(t.criticLayout),this.targetCritic=this.critic.clone(),this.actor=new d(t.actorLayout),this.targetActor=this.actor.clone(),this.getInitialStateFunc=t.getInitialStateFunc,this.doActionFunc=t.doActionFunc,this.actionDimension=t.actorLayout[t.actorLayout.length-1],this.criticActionIndices=m(Array(this.actionDimension).keys()),this.replayBuffer=new g(t.replayMaxLength),this.minibatchesSize=t.minibatchesSize,this.gamma=t.gamma,this.alpha=t.alpha,this.tau=t.tau}var i=t.prototype;return i.initializeExhibition=function(){this.exhibitState=this.getInitialStateFunc()},i.step=function(){var t=this.doActionFunc(this.exhibitState,this.actor.process(this.exhibitState)),i=t[1];return this.exhibitState=i,t[0]},i.onTimeStep=function(t){this.onTimeStep=t},i.onExploreRep=function(t){this.onExploreRep=t},i.learn=function(t,i){var e=new y(.15,.3,this.actionDimension);e.reset();for(var n=this.getInitialStateFunc(),s=0;s<t;s++){this.explore(n,i,e),this.update();var a=this.actor.process(n),r=this.doActionFunc(n,a),o=r[0],c=r[1];n=500===o?this.getInitialStateFunc():c,this.onTimeStep()}},i.update=function(){var t=this;this.replayBuffer.sample(this.minibatchesSize).forEach((function(i){var e=i[0],n=i[1],s=i[2],a=i[3],r=t.targetActor.process(a),o=t.targetCritic.process([].concat(m(r),m(a))),c=s+t.gamma*o,h=t.critic.process([].concat(m(n),m(e)));t.critic.learn(t.alpha,[h-c]);var u=t.actor.process(e),l=t.critic.gradientWrtNthsInputAtState(t.criticActionIndices,[].concat(m(u),m(e)));t.actor.learn(t.alpha,[l])})),this.targetActor.lerp(this.actor,this.tau),this.targetCritic.lerp(this.critic,this.tau)},i.explore=function(t,i,e){for(var n=this.actor.process(t),s=0;s<i;s++){var a=e.nextValue(),r=u.add(n,a),o=this.doActionFunc(t,r),c=o[0],h=o[1];this.replayBuffer.push(t,r,c,h),this.onExploreRep()}},t}(),g=function(){function t(t){this.buffer=[],this.maxLength=t,this.isFull=!1}var i=t.prototype;return i.push=function(t,i,e,n){this.buffer.push([t,i,e,n]),this.isFull?this.buffer.shift():this.buffer.length===this.maxLength&&(this.isFull=!0)},i.sample=function(t){var i=[];t<this.buffer.length&&(t=this.buffer.length);for(var e=0;e<t;e++){var n=Math.floor(Math.random()*this.buffer.length);i.push(this.buffer[n])}return i},t}(),y=function(){function t(t,i,e){void 0===t&&(t=.15),void 0===i&&(i=.3),void 0===e&&(e=1),this.dimensionCount=e,this.theta=t,this.sigma=i,this.reset()}var i=t.prototype;return i.reset=function(){this.state=u.zeroes(this.dimensionCount)},i.walk=function(){var t=u.add(u.scale(-this.theta,this.state),u.scale(this.sigma,b.normalUnitCombination(this.dimensionCount)));this.state=u.add(this.state,t)},i.nextValue=function(){return this.walk(),this.state},t}(),S=function(){function t(){}var i=t.prototype;return i.setCriticLayout=function(t){this.criticLayout=t},i.setActorLayout=function(t){this.actorLayout=t},i.setGetInitialStateFunc=function(t){this.getInitialStateFunc=t},i.setDoActionFunc=function(t){this.doActionFunc=t},i.setReplayMaxLength=function(t){this.replayMaxLength=t},i.setMiniBatchesSize=function(t){this.minibatchesSize=t},i.setGamma=function(t){this.gamma=t},i.setAlpha=function(t){this.alpha=t},i.setTau=function(t){this.tau=t},i.build=function(){return new v(this)},t}(),b=function(){function t(){}return t.normalUnit=function(){return Math.pow(-2*Math.log(Math.random()),.5)},t.normalUnitCombination=function(i){for(var e=t.normalUnit(),n=[e],s=1;s<i;s++){var a=2*Math.PI*Math.random();n.push(e*Math.cos(a));for(var r=0;r<s;r++)n[r]*=Math.sin(a)}return n},t}(),w=S;var A=function(t){var i,e;function n(i){var e;(e=t.call(this,i)||this).train=function(){var t=e.lengthRef.current.value,i=e.explorationRef.current.value;e.ddgd.learn(t,i),e.ddgd.initializeExhibition()},e.restart=function(){e.ddgd.initializeExhibition()},e.displayRef=s.a.createRef(),e.simulator=new h;var n=new w;return n.setCriticLayout([14,14,14,1]),n.setActorLayout([11,11,11,3]),n.setGetInitialStateFunc(e.simulator.getInitialState.bind(e.simulator)),n.setDoActionFunc(e.simulator.doAction.bind(e.simulator)),n.setReplayMaxLength(1e7),n.setMiniBatchesSize(100),n.setGamma(.5),n.setAlpha(.1),n.setTau(.01),e.ddgd=n.build(),e.lengthRef=s.a.createRef(),e.explorationRef=s.a.createRef(),e.state={reward:0},e}e=t,(i=n).prototype=Object.create(e.prototype),i.prototype.constructor=i,i.__proto__=e;var r=n.prototype;return r.componentDidMount=function(){var t=0,i=0;this.ddgd.onTimeStep((function(){i++,t=0,console.log("t "+i)})),this.ddgd.onExploreRep((function(){++t%500==0&&console.log("e "+t)})),this.ddgd.initializeExhibition(),this.exhibitInterval=setInterval(this.step.bind(this),16)},r.step=function(){var t=this.ddgd.step();this.setState({reward:t}),this.forceUpdate()},r.render=function(){return s.a.createElement("div",null,s.a.createElement(a,{ref:this.displayRef,circles:[this.simulator.a,this.simulator.b,this.simulator.c],focusedOnCircle:this.simulator.c,fuelPercentage:this.simulator.c.fuel,reward:this.state.reward}),s.a.createElement("div",null,s.a.createElement("label",null,"length",s.a.createElement("input",{type:"text",defaultValue:"5",ref:this.lengthRef})),s.a.createElement("label",null,"exploration",s.a.createElement("input",{type:"text",defaultValue:"5",ref:this.explorationRef})),s.a.createElement("input",{type:"button",value:"TRAIN",onClick:this.train})),s.a.createElement("input",{type:"button",value:"RESTART",onClick:this.restart}))},n}(s.a.Component);i.default=A}}]);
//# sourceMappingURL=component---src-pages-ai-js-a528c39394ded30dea8a.js.map