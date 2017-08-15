<template>

  <div style="height: 100%;">
    
  </div>

</template>

<script>
import eventBus from '../global-events';

export default {
  props: ['client'],
  data() {
    return {
    }
  },

  watch: {
    'client': function(client, oldClient) {
      if (oldClient) {
        this.detatchClient(oldClient);
      }

      if (client){
        this.attachClient(client);
      }
    }
  },

  created() {
  	// this.client.connect();
  },

  mounted() {
  	if (this.client)
      this.attachView();
    eventBus.$on('resize', this.resizeView);
  },

  updated() {
    if (this.client) {
    	let view = this.client.view;
    	if (view.parentElement !== this.$el) {
    		view.parentElement.removeChild(view);
  	  	this.attachView();
    	}
    }
  },

  beforeDestroy() {
    if (this.client)
      this.detatchClient(this.client);
    eventBus.$off('resize', this.resizeView);
  },

  methods: {
  	attachView() {
	  	this.$el.appendChild(this.client.view);
	  	this.resizeView();
  	},

  	resizeView() {
	  	this.client.resize(this.$el.offsetWidth, this.$el.offsetHeight);
  	},

    attachClient(client) {
      client.connect();
      this.attachView();
    },

    detatchClient(client) {
      let view = client.view;
      if (view.parentElement)
        view.parentElement.removeChild(view);
      // client.destroy();
      client.disconnect();
    }
  }
}
</script>

<style>

</style>
