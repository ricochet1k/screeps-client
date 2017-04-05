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
            <select :value="roomName" @input="client.setRoom($event.target.value)">
              <option v-for="roomName in rooms" :key="roomName" :value="roomName">
                {{ roomName }}
              </option>
            </select>
            <input id="room" :value="roomName" @change="client.setRoom($event.target.value)" />
          </div>
        </div>
      </td></tr>
      <tr><td id="main-td">
        <div id="main">
          <split-pane @resize="onResize()">
            <div slot="left" style="height: 100%;">
              <div id="roomMaps">
                <room-map v-for="roomName in rooms" :key="roomName" :room-name="roomName" :api="api" @click="client.setRoom(roomName)"></room-map>
              </div>
              <game :client="client"></game>
            </div>
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
import RoomMap from './RoomMap.vue';
import eventBus from '../global-events';
import { ScreepsAPI } from '../scripts/screepsAPI';
import {ScreepsClient} from '../scripts/client';

export default {
  data() {
    let host;
    let secure;
    let port;
    let email = '';
    let password = '';

    let saved = window.localStorage.getItem('saved-credentials');
    if (saved) saved = JSON.parse(saved);

    if (saved) {
      host = saved.host;
      port = saved.port;
      secure = saved.secure;
      email = saved.email;
      password = saved.password;
    } else {
      host = window.location.hostname;
      secure = window.location.protocol === 'https:';
      port = window.location.port || (secure? '443' : '21025');

      if (window.location.hostname === "localhost") {
        host = 'screeps-test.ags131.ovh';
        port = 21025;
        secure = false;
      }
    }

    return {
      host,
      port,
      secure,

      email,
      password,

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
      window.localStorage.setItem("saved-credentials", JSON.stringify({
        host: this.host,
        port: this.port,
        secure: this.secure,

        email: this.email,
        password: this.password,
      }))

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
    RoomMap,
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
