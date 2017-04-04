
import objectTypes from './objects';
import {SQUARE_SIZE} from './const';
import Grid from './utils/grid';
import {renderTerrain} from './terrain';

export class Room {
  constructor(screeps, name) {
    this.name = name;

    this.g = new PIXI.Container();
    // stage.addChild(this.g);
    this.g.scale.set(15 / SQUARE_SIZE, 15 / SQUARE_SIZE);

    this.terrainG = new PIXI.Graphics();
    // terrainG.cacheAsBitmap = true; // renders as black?
    this.g.addChild(this.terrainG);

    let layers = [
      'road', 
      'container', 
      'energy', 
      'extension', 
      'mineral', 
      'source', 
      'controller',
      'spawn', 
      'storage', 
      'tower', 
      'creep', 
      'rampart',
      'unknown'
    ];
    this.layers = {};
    for (let layer of layers) {
      let l = new PIXI.Container();
      // l.scale.set(10 / SQUARE_SIZE, 10 / SQUARE_SIZE);
      this.layers[layer] = {container: l, grid: new Grid(50, 50)};
      this.g.addChild(l);
    }

    this.roomObjects = {};

    
    screeps.roomTerrain(name, true).then(t =>{
      console.log("terrain", name, t);
      if (t.error) {
        console.log("terrain error", t.error, name);
      }
      renderTerrain(this.terrainG, t.terrain[0].terrain);
    });
  }



  updateRoom(room) {
    for (let id in room.objects) {
      let obj = room.objects[id];


      let robj = this.roomObjects[id];


      if (obj === null) {
        if (robj)
          robj.g.parent.removeChild(robj.g);
        delete this.roomObjects[id];
        continue;
      }

      let created = false;
      let type = 'unknown';
        
      if (!robj) {
        if (!obj.type) continue; // diff of object we don't have

        if (obj.type in objectTypes)
          type = obj.type;

        let objType = objectTypes[type];
        // if (!objType) {
        //   console.log("unknown object: ", obj);
        //   continue;
        //   // objType = objectTypes.unknown;
        // }

        robj = new objType(obj);
        this.roomObjects[id] = robj;
        this.layers[type].container.addChild(robj.g);

        created = true;
      }
      else if (robj.obj.type in objectTypes)
        type = robj.obj.type;


      robj.update(obj, this);

      if (created || robj.lastObj.x !== robj.obj.x 
            || robj.lastObj.y !== robj.obj.y) {
        let grid = this.layers[type].grid;
        grid.set(robj.lastObj.x, robj.lastObj.y, undefined);
        grid.set(robj.obj.x, robj.obj.y, robj);
      }
    }
  }

  preRender(timestamp) {

    for (let id in this.roomObjects) {
      let robj = this.roomObjects[id];

      robj.preRender(timestamp, this);
    }

  }
}