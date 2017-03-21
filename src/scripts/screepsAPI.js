// import WebSocket from 'ws';
import { EventEmitter } from 'events';
import axios from 'axios/dist/axios';
import pako from 'pako';
import { Buffer } from 'buffer';

export class ScreepsAPI extends EventEmitter {
  set email(v) {
    this.opts.email = v
  }

  set password(v) {
    this.opts.password = v
  }

  constructor (opts) {
    super()
    opts = opts || {}
    // if (!opts.email || !opts.password) throw new Error('Email and password REQUIRED')
    this.opts = opts
    if (opts.host && opts.port && opts.secure !== undefined)
      this.prefix = (opts.secure? 'https' : 'http') + '://' + opts.host + ":" + opts.port
    else
      this.prefix = opts.ptr ? 'https://screeps.com/ptr' : 'https://screeps.com'
  }

  async req(method, path, body) {
    if (!this.token && !path.match(/auth/)) 
      return this.getToken(() => this.req(method, path, body, cb))

    let res = await axios({
      url: this.prefix + path,
      json: true,
      method,
      headers: {
        'X-Token': this.token || undefined,
        'X-Username': this.token || undefined
      },
      data: method == 'POST' ? body : undefined || undefined,
      params: method == 'GET' ? body : undefined || undefined
    });

    if (res.status == 200) {
      if (res.headers['x-token'])
        this.token = res.headers['x-token']
    }
    if (res.status == 401) {
      this.token = ''
    }

    return res;
  }

  connect() {
    console.log('connect')
    return this.getToken()
  }
  auth(email, password) {
    this.email = email
    this.password = password
    return this.getToken()
    //(err, token) => cb(null, token !== 'unauthorized')
  }

  async getToken() {
    console.log('getToken')
    let {email, password} = this.opts
    let res = await this.req('POST', '/api/auth/signin', {email, password});

    if (res.status == 200) {
      this.token = res.data.token
      return res.data.token;
    } else {
      throw 'unauthorized';
    }
  }

  async me() {
    if (!this.token) await this.getToken();
    let res = await this.req('GET', '/api/auth/me', null);
    this.user = res.data;
    return res.data;
  }

  async console(expression) {
    let res = await this.req('POST', '/api/user/console', {expression});
    return res.data;
  }

  async socket () {
    if (this.ws) return Promise.resolve();
    if (!this.token) await this.getToken();
    if (!this.user) await this.me();
    let wsprefix = this.prefix.replace(/^http/, 'ws')
    let ws = new WebSocket(`${wsprefix}/socket/websocket`);
    // console.log('ws', ws);
    this.ws = ws;
    ws.onmessage = event => {
      // console.log("wsmessage", event);
      let msg = event.data;
      if (msg.slice(0, 3) == 'gz:'){
        // console.log("inflate: ", inflate(msg));
        // console.log("gz: ", gz(msg));
        
        msg = gz(msg)
      }
      if (msg[0] == '[') msg = JSON.parse(msg)
      // if (msg[0].match(/console/))
      //   this.emit('console', msg)
      // else if (msg[0].match(/memory/))
      //   this.emit('memory', msg)
      // else if (msg[0].match(/code/))
      //   this.emit('code', msg)
      // else if (msg[0].match(/room/))
      //   this.emit('room', msg)
      // else
        this.emit('message', msg)
    };
    return await new Promise((resolve, reject) => {
      ws.onopen = () => {
        this.wssend('gzip on');
        this.wssend(`auth ${this.token}`);
        resolve();
      };
    })
  }

  subscriptions = {};
  subscribe(path) {
    // if (!path.match(/^([a-z]+):(.+?)$/))
    //   path = `user:${this.user._id}${path}`
    if (this.subscriptions[path]) return;
    this.wssend(`subscribe ${path}`);
    this.subscriptions[path] = true;
  }

  unsubscribe(path) {
    // if (!path.match(/^([a-z]+):(.+?)$/))
    //   path = `user:${this.user._id}${path}`
    this.wssend(`unsubscribe ${path}`);
    this.subscriptions[path] = false;
  }

  wssend(...data) {
    // console.log('ws', ...data)
    this.ws.send(...data)
  }

  get memory () {
    return {
      get: (path, def) => {
        return this.req('GET', `/api/user/memory`, {path: path || ''})
          .then(data => {
            if (data.body.error) throw data.body.error
            let ret = data.body.data || def
            if (typeof ret == 'string' && ret.slice(0, 3) == 'gz:') ret = gz(ret)
            return ret
          })
      },
      set: (path, value) => {
        return this.req('POST', `/api/user/memory`, {path, value})
          .then(data => {
            if (data.body.error) throw data.body.error
            return data.body.data
          })
      }
    }
  }

  get market () {
    return {
      index: () => {
        return this.req('GET', `/api/game/market/index`, null)
          .then(data => {
            if (data.body.error) throw data.body.error
            let ret = data.body.list
            if (typeof ret == 'string' && ret.slice(0, 3) == 'gz:') ret = gz(ret)
            return ret
          })
      },
      orders: (type) => {
        return this.req('GET', `/api/game/market/orders?resourceType=${type}`, null)
          .then(data => {
            if (data.body.error) throw data.body.error
            let ret = data.body.list
            if (typeof ret == 'string' && ret.slice(0, 3) == 'gz:') ret = gz(ret)
            return ret
          })
      },
      stats: (type) => {
        return this.req('GET', `/api/game/market/stats?resourceType=${type}`, null)
          .then(data => {
            if (data.body.error) throw data.body.error
            let ret = data.body.stats
            if (typeof ret == 'string' && ret.slice(0, 3) == 'gz:') ret = gz(ret)
            return ret
          })
      }
    }
  }

  /**
   *  {ok: 1, time: 17652988}
   */
  async time() {
    let res = await this.req('GET', '/api/game/time');
    return res.data;
  }

  /**
   * {"ok":1,"status":"normal"}
   */
  async worldStatus() {
    let res = await this.req('GET', '/api/user/world-status');
    return res.data;
  }

  /**
   * {"ok":1,"count":0}
   */
  async unreadCount() {
    let res = await this.req('GET', '/api/user/messages/unread-count');
    return res.data;
  }

  /**
   * {"ok":1,"room":{"_id":"E82N7","status":"normal","novice":1488620978881}}
   */
  async roomStatus(room) {
    let res = await this.req('GET', '/api/game/room-status', {room});
    return res.data;
  }

  /**
   * {"ok":1,"terrain":[{"_id":"5873be0611e3e4361b4da2c7","room":"E82N7","terrain":<2500 of 0, 1 or 2 as a string>,"type":"terrain"}]}
   */
  roomTerrainCache = {};
  async roomTerrain(room, encoded) {
    let cached;
    if (cached = this.roomTerrainCache[room + !!encoded])
      return cached;
    let res = await this.req('GET', '/api/game/room-terrain', {room, encoded: encoded? 'true' : undefined});
    this.roomTerrainCache[room + !!encoded] = res.data;
    return res.data;
  }

  /**
   * branch can be "$activeWorld" to get the active branch
   * {"ok":1,"branch":"ts-default","modules":{"main":<string of code>}}
   */
  async code(branch) {
    let res = await this.req('GET', '/api/user/code', {branch});
    return res.data;
  }

  /**
   * {"ok":1,"rooms":[]}
   */
  async respawnProhibitedRooms() {
    let res = await this.req('GET', '/api/user/respawn-prohibited-rooms');
    return res.data;
  }

  /**
   * {"ok":1,"rooms":["E83N7"]}
   */
  async rooms(id) {
    if (id === undefined) id = this.user._id;
    let res = await this.req('GET', '/api/user/rooms', {id});
    return res.data;
  }

  /**
   * {"ok":1,"stats":{"creepsLost":25,"creepsProduced":20199,"energyHarvested":2756044,"energyControl":1180464,"energyCreeps":1305150,"energyConstruction":251876}}
   */
  async stats(id, interval) {
    if (id === undefined) id = this.user._id;
    let res = await this.req('GET', '/api/user/stats', {id, interval});
    return res.data;
  }

  /**
   * {"ok":1,"user":{"_id":"...","username":"ricochet1k","badge":{"type":19,"color1":"#000000","color2":"#3a0080","color3":"#05004d","param":0,"flip":false},"steam":{"id":"..."},"gcl":9001809}}
   */
  async userFind(username) {
    let res = await this.req('GET', '/api/user/find', {username});
    return res.data;
  }

  /**
   * {"ok":1,"list":[{"_id":"5863de22ec0e632daa8550e6","season":"2016-12","user":"585c1fadbadd410834155410","score":146093,"rank":2278},{"_id":"586846a0ec0e632daa907c34","season":"2017-01","user":"585c1fadbadd410834155410","score":4798156,"rank":797},{"_id":"589125349c76d517f2424b27","season":"2017-02","user":"585c1fadbadd410834155410","score":3927406,"rank":745}]}
   */
  async leaderboardFind(username, mode) {
    let res = await this.req('GET', '/api/leaderboard/find', {username, mode});
    return res.data;
  }
}

function gz (data) {
  let buf = new Buffer(data.slice(3), 'base64')
  // let ret = zlib.gunzipSync(buf).toString();
  let ret = pako.ungzip(buf, {to: "string"});
  // console.log("gz:", data);
  // console.log("ungz:", ret);
  try {
    return JSON.parse(ret);
  } catch (e) {
    console.error(e);
    return null;
  }
}

function inflate (data) {
  let buf = new Buffer(data.slice(3), 'base64')
  // let ret = zlib.inflateSync(buf).toString();
  let ret = pako.deflate(buf, {to: "string"});
  // console.log("inflate:", data);
  // console.log("uninflate:", ret);
  try {
    return JSON.parse(ret);
  } catch (e) {
    console.error(e);
    return null;
  }
}

function noop () {}
