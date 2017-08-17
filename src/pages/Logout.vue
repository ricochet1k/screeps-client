<template>
	<div>
		
	</div>
</template>

<script>

import auth from '../auth';

export default {
  data() {
  	return {
      auth,
    }
  },

  mounted() {
    auth.clearSaved();
    auth.load();
    this.$router.replace('/login');
  },

}
</script>

<style>

</style>