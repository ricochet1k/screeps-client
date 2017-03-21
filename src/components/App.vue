<template>

  <div id="app">
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
      api:  new ScreepsAPI({
        host: 'archcygnus',
        port: 21025,
        secure: false,

        email: 'ricochet1k',
        password: 'asdf',
      })
    }
  },


  methods: {
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
html, body, #app {
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
}

</style>
