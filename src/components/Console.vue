<template>

  <div class="console" ref="console" style="height: 100%;">
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

  created() {
    this.api.on("message", this.onMessage);
  },

  mounted() {
  },

  updated() {
  },

  beforeDestroy() {
    this.api.off("message", this.onMessage);
  },

  methods: {
    onMessage(msg) {
      if (msg[0].match(/\/console$/)) {
        // console.log('console!', msg[1]);
        const con = this.$refs.console;
        let isAtBottom = con.scrollHeight - con.clientHeight <= con.scrollTop + 1;
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
