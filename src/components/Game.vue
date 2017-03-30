<template>

  <div style="height: 100%;">
    
  </div>

</template>

<script>
import {ScreepsClient} from '../scripts/client';
import eventBus from '../global-events';

export default {
  props: ['api'],
  data() {
    return {
    	client: undefined,
    }
  },

  watch: {
    'api': function() {
      if (this.client) {
        this.detatchClient();
      }

      if (this.api){
        this.client = new ScreepsClient(this.api);
        this.attachClient();
      }
      else
        this.client = undefined;
    }
  },

  created() {
  	// this.client.connect();
  },

  mounted() {
  	if (this.client)
      this.attachView();
  },

  updated() {
    if (this.client) {
    	let view = this.client.renderer.view;
    	if (view.parentElement !== this.$el) {
    		view.parentElement.removeChild(view);
  	  	this.attachView();
    	}
    }
  },

  beforeDestroy() {
    this.detatchClient();
  },

  methods: {
  	attachView() {
	  	this.$el.appendChild(this.client.renderer.view);
	  	this.resizeView();
  	},

  	resizeView() {
	  	this.client.renderer.resize(this.$el.offsetWidth, this.$el.offsetHeight);
  	},

    attachClient() {
      eventBus.$on('resize', this.resizeView);
      this.client.connect();
      this.attachView();
    },

    detatchClient() {
      let view = this.client.renderer.view;
      view.parentElement.removeChild(view);
      this.client.renderer.destroy();
      this.client.disconnect();
      eventBus.$off('resize', this.resizeView);
    }
  }
}
</script>

<style>

</style>
