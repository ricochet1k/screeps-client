// import 'pixi.js/dist/pixi'; // TODO: Get imports working better with Rollup...

import {Room} from './room';
import {tween} from './tween';

console.log("PIXI: ", PIXI);

var type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type);

/*
  Vue likes to observe anything that get stored in its instances,
  transitively all the way down. This has a bad effect on PIXI's 
  rendering speed, so we use Symbols to store the data instead,
  which Vue doesn't observe.
*/
export const ROOM = Symbol('ROOM');
export const RENDERER = Symbol('RENDERER');
export const STAGE = Symbol('STAGE');

export class ScreepsClient {
  constructor(screeps) {
    this.screeps = screeps;
    let renderer = this[RENDERER] = PIXI.autoDetectRenderer(256, 256, {antialias: true});

    // renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;

    this.render = true;

    // document.body.appendChild(renderer.view);

    this[STAGE] = new PIXI.Container();

    this.onMessage = this.onMessage.bind(this);

    this.money = null;
    this.cpuMemory = {cpu: 0, memory: 0};

    this.roomName = "";
    this.rooms = [];
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
    this.rooms = rooms;
    console.log(rooms);

    if (this.roomName !== "")
      this.setRoom(this.roomName);

    requestAnimationFrame(ts => { this.gameLoop(ts); });
  }

  setRoom(roomName) {
    console.log('client setRoom', roomName);
    this.roomName = roomName;
    if (this[ROOM]){
      this.screeps.unsubscribe(`room:${this[ROOM].name}`);
      this[STAGE].removeChild(this[ROOM].g);
      this[ROOM] = undefined;
    }

    if (roomName !== "") {
      this.screeps.unsubscribe(`room:${roomName}`);
      this.screeps.subscribe(`room:${roomName}`);
      this[ROOM] = new Room(this.screeps, roomName);
      this[STAGE].addChild(this[ROOM].g);
    }
  }


  onMessage(msg) {
    if (typeof msg === "string" && msg.match(/^auth/)) {
      console.log("AUTH", msg);
      this.finishConnecting();
    } else if (msg[0].match(/^room:/) && this[ROOM]) {
      this[ROOM].updateRoom(msg[1]);
    } else if (msg[0].match(/^user:\w+\/money$/)) {
      this.money = msg[1];
    } else if (msg[0].match(/^user:\w+\/cpu$/)) {
      this.cpuMemory = msg[1];
    } else if (msg[0].match(/^user:\w+\/console$/)) {
      // ignore
    } else if (msg[0].match(/^roomMap2:/)) {
      // ignore
    } else {
      console.log("message", msg)
    }
  }


  // let lastTimestamp;
  gameLoop(timestamp) {
    // console.log('render', timestamp);
    if (this.render) requestAnimationFrame(ts => this.gameLoop(ts));

    if (this[ROOM]) this[ROOM].preRender(timestamp);

    tween.update(timestamp);

    this[RENDERER].render(this[STAGE]);
  }
  // requestAnimationFrame(ts => { lastTimestamp = ts; gameLoop(ts); });

  resize(...args) {
    return this[RENDERER].resize(...args);
  }

  get view() {
    return this[RENDERER].view;
  }
}


