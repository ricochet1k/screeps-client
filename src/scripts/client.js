// import 'pixi.js/dist/pixi'; // TODO: Get imports working better with Rollup...

import {Room} from './room';
import {tween} from './tween';

console.log("PIXI: ", PIXI);

var type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type);

export class ScreepsClient {
  constructor(screeps) {
    this.screeps = screeps;
    let renderer = this.renderer = PIXI.autoDetectRenderer(256, 256, {antialias: true});

    // renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;

    this.render = true;

    // document.body.appendChild(renderer.view);

    this.stage = new PIXI.Container();

    this.onMessage = this.onMessage.bind(this);
  }

  connect() {

    // screeps.on("console", line => console.log("console", line));
    // screeps.on("memory", line => console.log("memory", line));
    // screeps.on("code", line => console.log("code", line));
    // screeps.on("room", roomMsg => {
    //   console.log("room", roomMsg);
    //   room.updateRoom(roomMsg[1]);
    // });
    this.screeps.on("message", this.onMessage);


    this.startScreepsConn().catch(e => console.error('client.connect()', e));
  }

  disconnect() {
    this.screeps.removeListener("message", this.onMessage);
    this.run = false;
  }



  async startScreepsConn() {
    let screeps = this.screeps; 

    await screeps.connect();
    this.me = await screeps.me();
    console.log('me', this.me);
    await screeps.socket();
  }

  async finishConnecting() {
    let screeps = this.screeps; 
    let me = this.me;

    screeps.subscribe('server-message');
    screeps.subscribe(`user:${me._id}/money`);
    screeps.subscribe(`user:${me._id}/cpu`);
    screeps.subscribe(`user:${me._id}/newMessage`);
    screeps.subscribe(`user:${me._id}/memory`);
    screeps.subscribe(`user:${me._id}/console`);
    screeps.subscribe(`user:${me._id}/set-active-branch`);
    screeps.subscribe(`user:${me._id}/code`);

    let {rooms} = await screeps.rooms();
    console.log(rooms);


    this.room = new Room(screeps, rooms[0]);
    this.stage.addChild(this.room.g);

    screeps.unsubscribe(`room:${rooms[0]}`);
    screeps.subscribe(`room:${rooms[0]}`);


    requestAnimationFrame(ts => { this.gameLoop(ts); });
  }


  onMessage(msg) {
    if (typeof msg === "string" && msg.match(/^auth/)) {
      console.log("AUTH", msg);
      this.finishConnecting();
    } else if (msg[0].match(/^room:/) && this.room) {
      this.room.updateRoom(msg[1]);
    } else {
      console.log("message", msg)
    }
  }


  // let lastTimestamp;
  gameLoop(timestamp) {
    // console.log('render', timestamp);
    if (this.render) requestAnimationFrame(ts => this.gameLoop(ts));

    if (this.room) this.room.preRender(timestamp);

    tween.update(timestamp);

    this.renderer.render(this.stage);
  }
  // requestAnimationFrame(ts => { lastTimestamp = ts; gameLoop(ts); });

}


