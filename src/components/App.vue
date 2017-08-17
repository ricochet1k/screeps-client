<template>

  <div id="app">
    <div id="links">
      <router-link :to="{name: 'login'}">login</router-link>
      <router-link :to="{name: 'register'}">register</router-link>
      <router-link :to="{name: 'room', params: {roomName: 'E0N0'}}">room</router-link>
      <router-link :to="{name: 'map'}">map</router-link>
      <router-link :to="{name: 'logout'}">logout</router-link>
    </div>
    <router-view></router-view>
  </div>

</template>

<script>

import eventBus from '../global-events';
import { ScreepsAPI } from '../scripts/screepsAPI';
import {ScreepsClient} from '../scripts/client';

export default {
  data() {
    return {}
  },

  components: {
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
  /*display: flex;*/
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
}

#app > table {
  height: 100%;
}

#topbar {
  /*height: 20px;*/
}

#main-td {
  position: relative;
  height: 100%;
}

#main {
  /*flex: 1;*/
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

#roomMaps {
  flex-direction: row;
  display: flex;
  height: calc(150px + 1em + 4px + 1em); /* scrollbar */
  background: black;
  overflow-y: hidden;
  overflow-x: scroll;
}

</style>
