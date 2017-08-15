<template>
  <div class="roomMap2" @click="$emit('click', $event)">
    <img :src="background" />
    <div class="overlay" v-for="k in kinds" :key="k">
      <div class="mapSpot" v-for="(xy, i) in data[k]" :key="i" :style="mapSpotStyle(k, xy)">
      </div>
    </div>
    <div class="roomMapName">{{roomName}}</div>
  </div>
</template>

<script>
const colors = {
  'r': '#555555', // road
  'c': '#0000ff', // controller
  'k': '#aa0000', // keeperLair
  'm': '#8888ff', // mineral
  'p': '#ff00ff', // portal
  'pb': '#88ff88', // powerBank || power
  's': '#ffff00', // source
  'w': '#000000', // wall

  // default - any user-owned structure
  '2': '#ff0000', // invader
  'me': '#00aa00', // All my stuff
  'user': '#990000', // All enemy stuff
};

export default {
  props: ['roomName', 'api'],
  data: function() {
    return {
      data: {},
    }
  },
  mounted() {
    // console.log('roomMap mounted', this, this.$props);
    if (this.api && this.api.connected) this.connect(this.api);
  },
  beforeDestroy() {
    if (this.api) this.disconnect(this.api);
  },

  watch: {
    'api': function(api, oldapi) {
      if (oldapi) this.disconnect(oldapi);

      //if (api && api.connected) this.connect(api);
    },
    'connected': function(connected, old) {
      if (this.api && this.api.user)
        this.connect(this.api);
    }
  },

  computed: {
    background() {
      // console.log('background', this, this.api, this.roomName);
      if (!this.api) return "";

      const {host, port, secure} = this.api.opts;

      if (host === "screeps.com") { // official server uses a CDN
        if (this.roomName.indexOf('/') > -1)
          return `https://d3os7yery2usni.cloudfront.net/map/${this.roomName}.png`;
        return `https://d3os7yery2usni.cloudfront.net/map3/${this.roomName}.png`;
      }

      const proto = (secure? 'https' : 'http')
      let bg = `${proto}://${host}:${port}/assets/map/${this.roomName}.png`;
      // console.log('bg ', bg);
      return bg;
    },
    msg() {
      return "roomMap2:"+this.roomName;
    },
    kinds() {
      return this.data? Object.keys(this.data) : [];
    },
    connected() {
      return this.api && this.api.connected;
    }
  },

  methods: {
    connect(api) {
      api.on('message', this.onMessage);
      api.subscribe(this.msg);
    },

    disconnect(api) {
      if (api.off) api.off('message', this.onMessage);
      api.unsubscribe(this.msg);
    },

    onMessage(msg) {
      if (msg[0] === this.msg) {
        // console.log('roomMap!', Object.keys(msg[1]), JSON.stringify(msg[1]));
        this.data = msg[1];
      }
    },
    color(kind) {
      let c = colors[kind];
      if (!c) {
        if (kind === this.api.user._id)
          c = colors[kind] = colors['me'];
        else
          c = colors[kind] = colors['user'];
        // console.log("Unknown roomMap2 color: ", kind);
      }
      return c;
    },

    mapSpotStyle(kind, spot) {
      // console.log('mapSpotStyle', kind, spot);
      return {top: 3*spot[1]+'px', left: 3*spot[0]+'px', background: this.color(kind)};
    }
  }
}
</script>

<style>
.roomMap2 {
  position: relative;
  width: 150px;
  height: calc(150px + 1em + 4px);
}

.roomMapName {
  margin: 0;
  padding: 0;
  /*color: white;*/
  font-size: 1em;
  font-family: monospace;
  line-height: 1em;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
}

.mapSpot {
  position: absolute;
  width: 3px;
  height: 3px;
}

img {
  width: 150px;
  height: 150px;
}
</style>
