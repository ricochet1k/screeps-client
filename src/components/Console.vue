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
    }
  },

  watch: {
    'api': function(api, oldApi) {
      this.disconnect(oldApi);
      this.connect(api);
    }
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
    connect(api) {
      if (api && api.on)
        api.on("message", this.onMessage);
    },

    disconnect(api) {
      if (api && api.off)
        api.off("message", this.onMessage);
    },

    onMessage(msg) {
      if (msg[0].match(/\/console$/)) {

        const con = this.$refs && this.$refs.consoleWrapper;
        let isAtBottom = false;
        if (con) {
          isAtBottom = con.scrollHeight - con.clientHeight <= con.scrollTop + 1;
        }
        for (let m of msg[1].messages.log) {
          this.lines.push(m);
        }

        if (isAtBottom)
          this.$nextTick(() => {
            con.scrollTop = con.scrollHeight;
          })
      }
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
