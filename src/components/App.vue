<template>

  <div id="app">
    <table cellpadding="0" cellspacing="0" width="100%" height="100%">
      <tr height="0%"><td id="topbar">
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
      </td></tr>
      <tr><td id="main-td">
        <router-view></router-view>
      </td></tr>
    </table>
  </div>

</template>

<script>

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
    }
  },

  mounted() {
    this.connect();

    if (this.$route.path === '/') {

      let unwatch = this.$watch(function() { return this.client && this.client.rooms && this.client.rooms[0] }, function(rooms) {
        console.log('watch rooms', rooms);
        if (!rooms || !rooms[0]) return;

        if (this.$route.path === '/') {
          this.$router.replace({name: 'room', params: {roomName: this.client.rooms[0]}});
        }
        unwatch();
      }, {immediate: true});
    }
  },

  computed: {
    api() {
      return eventBus.api;
    },
    client() {
      return eventBus.client;
    }
  },

  methods: {
    connect() {
      if (this.api) this.api.disconnect();
      if (this.client) this.client.disconnect();

      window.localStorage.setItem("saved-credentials", JSON.stringify({
        host: this.host,
        port: this.port,
        secure: this.secure,

        email: this.email,
        password: this.password,
      }))

      eventBus.api = new ScreepsAPI({
          host: this.host,
          port: this.port,
          secure: this.secure,

          email: this.email,
          password: this.password,
        })
      eventBus.client = new ScreepsClient(eventBus.api);
    }
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
