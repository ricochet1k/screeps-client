<template>
	<div>
		
	</div>
</template>

<script>

import eventBus from '../global-events';
import auth from '../auth';

export default {
  data() {
  	return {
      auth,
    }
  },

  mounted() {
    if (eventBus.client)
      eventBus.client.disconnect();
    if (eventBus.api)
      eventBus.api.disconnect();
    eventBus.client = null;
    eventBus.api = null;
    auth.clearSaved();
    auth.load();
    this.$router.replace('/login');
  },

}
</script>

<style>

</style>