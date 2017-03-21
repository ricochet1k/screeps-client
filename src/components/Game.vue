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
    	client: new ScreepsClient(this.api),
    }
  },

  created() {
  	this.client.connect();
  },

  mounted() {
  	this.attachView();
  	eventBus.$on('resize', this.resizeView);
  },

  updated() {
  	let view = this.client.renderer.view;
  	if (view.parentElement !== this.$el) {
  		view.parentElement.removeChild(view);
	  	this.attachView();
  	}
  },

  beforeDestroy() {
  	let view = this.client.renderer.view;
  	view.parentElement.removeChild(view);
  	this.client.renderer.destroy();
    this.client.disconnect();
  	eventBus.$off('resize', this.resizeView);
  },

  methods: {
  	attachView() {
	  	this.$el.appendChild(this.client.renderer.view);
	  	this.resizeView();
  	},

  	resizeView() {
	  	this.client.renderer.resize(this.$el.offsetWidth, this.$el.offsetHeight);
  	}
  }
}
</script>

<style>

</style>
