<template>

  <div id="app">
    <div id="topbar">
      <label for="host">host:</label>
      <input id="host" v-model="host" />
      <label for="port">port:</label>
      <input id="port" v-model="port" />
      <label for="secure">secure:</label>
      <input id="secure" v-model="secure" type="checkbox" />
      <label for="email">email:</label>
      <input id="email" v-model="email" />
      <label for="password">password:</label>
      <input id="password" v-model="password" type="password" />

      <button @click="connect()">Connect</button>
    </div>
    <div id="main">
      <split-pane @resize="onResize()">
        <game slot="left" :api="api" />
        <div slot="right" style="height: 100%;">
          <split-pane-vertical>
            <div slot="left">&nbsp;</div>
            <console slot="right" :api="api" />
          </split-pane-vertical>
        </div>
      </split-pane>
    </div>
  </div>

</template>

<script>

import SplitPane from './SplitPane.vue';
import SplitPaneVertical from './SplitPaneVertical.vue';
import Game from './Game.vue';
import Console from './Console.vue';
import eventBus from '../global-events';
import { ScreepsAPI } from '../scripts/screepsAPI';

export default {
  data() {
    return {
      host: 'archcygnus',
      port: 21025,
      secure: false,

      email: 'ricochet1k',
      password: 'asdf',

      api: null,
    }
  },

  methods: {
    connect() {
      this.api = new ScreepsAPI({
          host: this.host,
          port: this.port,
          secure: this.secure,

          email: this.email,
          password: this.password,
        })
    },
    onResize() {
      eventBus.$emit('resize');
    }
  },

  components: { 
    Game,
    Console,
    SplitPane,
    SplitPaneVertical,
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
  position: relative;
}

#app {
  flex-direction: column;
  display: flex;
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
}

#top {
  /*height: 20px;*/
}

#main {
  flex: 1;
}

</style>
