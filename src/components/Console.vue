<template>

  <div class="console" ref="consoleWrapper" style="height: 100%;">
    <div class="console-line" v-for="line in lines" v-html="line">
    </div>
  </div>

</template>

<script>
import eventBus from '../global-events';

export default {
  props: ['api'],
  data() {
    return {
      lines: [],
      connected: false,
    }
  },

  watch: {
    'api': function(api, oldApi) {
      this.disconnect(oldApi);
      this.connect(api);
    },
  },

  created() {
    this.connect(this.api);
  },

  mounted() {
  },

  updated() {
  },

  beforeDestroy() {
    this.disconnect(this.api);
  },

  methods: {
    reconnect(api) {

    },
    connect(api) {
      if (api && api.socketAuth && api.subscribe){
        console.log('Console.connect', `user:${api.user._id}/console`, api)
        api.subscribe(`user:${api.user._id}/console`, this.onMessage);
        this.connected = true;
      }
    },

    disconnect(api) {
      this.connected = false;
      if (api && api.unsubscribe)
        api.unsubscribe(`user:${api.user._id}/console`, this.onMessage);
    },

    onMessage(key, msg) {
      const con = this.$refs && this.$refs.consoleWrapper;
      let isAtBottom = false;
      if (con) {
        isAtBottom = con.scrollHeight - con.clientHeight <= con.scrollTop + 1;
      }
      if (msg.messages && msg.messages.log) {
        for (let m of msg.messages.log) {
          this.lines.push(m);
        }
      } else if (msg.error) {
        this.lines.push(msg.error);
      } else {
        console.log('wierd console', msg);
      }

      if (isAtBottom)
        this.$nextTick(() => {
          con.scrollTop = con.scrollHeight;
        })
    }
  }
}
</script>

<style>
.console {
  color: #ccc;
  background: #222;
  font-size: 12px;
  font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
  overflow-y: scroll;

}
.console-line {
  font: monospace;
  word-wrap: normal;
  margin: 0;
}
</style>
