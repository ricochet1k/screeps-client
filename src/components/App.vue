<template>

  <div id="app">
    <table cellpadding="0" cellspacing="0" width="100%" height="100%">
      <tr height="0%"><td>
        <div id="topbar">
          <div>
            <form @submit.prevent="connect()">
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

              <button @click.prevent="connect()">Connect</button>
            </form>
          </div>
          <div>
            <span>Credits: {{money}}</span>
            <span>CPU: {{cpu}}</span>
            <span>Memory: {{memory}}</span>
            <select value="roomName" @input="client.setRoom($event.target.value)">
              <option v-for="roomName in rooms" v-bind:value="roomName">
                {{ roomName }}
              </option>
            </select>
          </div>
        </div>
      </td></tr>
      <tr><td id="main-td">
        <div id="main">
          <split-pane @resize="onResize()">
            <game slot="left" :client="client"></game>
            <div slot="right" style="height: 100%;">
              <split-pane-vertical>
                <div slot="left">&nbsp;</div>
                <console slot="right" :api="api"></console>
              </split-pane-vertical>
            </div>
          </split-pane>
        </div>
      </td></tr>
    </table>
  </div>

</template>

<script>

import SplitPane from './SplitPane.vue';
import SplitPaneVertical from './SplitPaneVertical.vue';
import Game from './Game.vue';
import Console from './Console.vue';
import eventBus from '../global-events';
import { ScreepsAPI } from '../scripts/screepsAPI';
import {ScreepsClient} from '../scripts/client';

export default {
  data() {
    return {
      host: 'screeps-test.ags131.ovh',//window.location.hostname,
      port: 21025,
      secure: false,

      email: 'ricochet1k',
      password: 'asdf',

      api: null,
      client: null,
    }
  },

  mounted() {
    this.connect();
  },

  computed: {
    money() {
      return this.client && this.client.money || 0;
    },
    cpu() {
      return this.client && this.client.cpuMemory? this.client.cpuMemory.cpu : 0;
    },
    memory() {
      return this.client && this.client.cpuMemory? this.client.cpuMemory.memory : 0;
    },
    roomName() {
      return this.client && this.client.roomName || "";
    },
    rooms() {
      return this.client && this.client.rooms || [];
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
      this.client = new ScreepsClient(this.api);
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

</style>
