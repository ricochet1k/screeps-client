<template>
  <div class="mapview" ref="mapview" style="height: 100vh; width: 100vw;"
    @mousedown.capture="mouseDown($event)" @mousemove.capture="mouseMove($event)" @mouseup.capture="mouseUp($event)" @click.capture="click($event)" >
    <div class="mapview-inner" :style="{left: xpan + 'px', top: ypan + 'px', width: (hsquares * squareSize)+'px', height: (vsquares * squareSize)+'px'}">
      <div class="y" v-for="y in vsquares" :key="y + yoffsetreal" :style="{width: hsquares*squareSize+'px', height: squareSize+'px'}">
        <div class="x" v-for="x in hsquares" :key="x + xoffsetreal" style="display: inline-block;" :style="{width: squareSize+'px', height: squareSize+'px'}">
          <room-map :style="{width: squareSize + 'px', height: squareSize + 'px'}" :room-name="roomName(x + xoffsetreal, y + yoffsetreal)" :api="api" @click="navigateToRoom(roomName(x + xoffsetreal, y + yoffsetreal))"></room-map>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import Game from './Game.vue';
import RoomMap from './RoomMap.vue';
import eventBus from '../global-events';

function fromRoomName(roomName) {
  let [name,,shard,h,wx,v,wy] = roomName.match(/^((\w+)\/)?([WE])([0-9]+)([NS])([0-9]+)$/);
  if(h == 'W') wx = ~wx;
  if(v == 'N') wy = ~wy;
  return [shard, wx, wy]
}

function toRoomName([shard, x, y]) {
  var result = "";
  if (shard)
    result += shard + '/';
  result += (x < 0 ? "W" + ~x : "E" + x);
  result += (y < 0 ? "N" + ~y : "S" + y);
  return result;
}


export default {
  name: 'map-view',
  props: ['shard'],

  data() {
    let xoffset = 0;
    let yoffset = 0;
    if (this.$route.query.x)
      xoffset = +this.$route.query.x;
    if (this.$route.query.y)
      yoffset = +this.$route.query.y;
    if (this.$route.query.room) {
      let [shard, wx, wy] = fromRoomName(this.$route.query.room);
      this.shard = shard;
      xoffset = +wx;
      yoffset = +wy;
    }
    return {
      squareSize: 150,
      totalMovement: 0,
      pan: {x: 0, y: 0},
      offsetWidth: 0,
      offsetHeight: 0,
      xoffset,
      yoffset,
    }
  },

  mounted() {
      this.offsetWidth = this.$refs.mapview.offsetWidth;
      this.offsetHeight = this.$refs.mapview.offsetHeight;
      console.log('mapView mounted', this.offsetWidth, this.offsetHeight, this.hsquares, this.vsquares);
  },

  computed: {
    api() {
      return eventBus.api;
    },
    client() {
      return eventBus.client;
    },

    xoffsetreal() {
      return this.xoffset - Math.ceil(this.offsetWidth / this.squareSize / 2)
    },
    yoffsetreal() {
      return this.yoffset - Math.ceil(this.offsetHeight / this.squareSize / 2)
    },

    hsquares() {
      //console.log('hsquares', this.offsetWidth, this.offsetWidth / this.squareSize);
      return Math.ceil(this.offsetWidth / this.squareSize) + 2;
    },
    vsquares() {
      return Math.ceil(this.offsetHeight / this.squareSize) + 2;
    },

    xpan() {
      return -this.pan.x - this.squareSize;
    },

    ypan() {
      return -this.pan.y - this.squareSize;
    }
  },

  methods: {
    roomName(x, y) {
      return toRoomName([this.shard, x, y])
    },

    navigateToRoom(roomName) {
      this.$router.push({name: 'room', params: {roomName}});
    },

    mouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      // console.log('mouseDown', e);
      this.totalMovement = 0;
    },
    mouseMove(e) {
      if (!e.buttons) return;

      //console.log('mouseMove', e);
      this.totalMovement += Math.abs(e.movementX) + Math.abs(e.movementY);
      this.pan.x -= e.movementX;
      while (this.pan.x < 0) {
        this.pan.x += this.squareSize;
        this.xoffset -= 1;
      }
      while (this.pan.x > this.squareSize) {
        this.pan.x -= this.squareSize;
        this.xoffset += 1;
      }
      this.pan.y -= e.movementY;
      while (this.pan.y < 0) {
        this.pan.y += this.squareSize;
        this.yoffset -= 1;
      }
      while (this.pan.y > this.squareSize) {
        this.pan.y -= this.squareSize;
        this.yoffset += 1;
      }
    },

    mouseUp(e) {
      if (this.totalMovement > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
      // console.log('mouseUp', this.totalMovement, e);
      //this.totalMovement = 0;
    },

    click(e) {
      // console.log('click', this.totalMovement, e);
      if (this.totalMovement > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  },

  components: {
    RoomMap,
  }

}
</script>


<style>

.mapview {
  overflow: hidden;
  position: relative;
}

.mapview-inner {
  position: relative;
}

</style>


