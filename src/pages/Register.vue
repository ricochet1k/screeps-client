<template>
	<div>
		<form @submit.prevent="register()">
          <div>
          	<label for="host">host:</label>
            <input id="host" v-model="host" />
          </div>
          <div>
            <label for="port">port:</label>
            <input id="port" v-model="port" />
          </div>
          <div>
            <label for="secure">secure:</label>
            <input id="secure" v-model="secure" type="checkbox" />
          </div>
          <div>
            <label for="username">username:</label>
            <input id="username" v-model="username" />
          </div>
          <div>
            <label for="email">email:</label>
            <input id="email" v-model="email" />
          </div>
          <div>
            <label for="password">password:</label>
            <input id="password" v-model="password" type="password" />
          </div>

          <button @click.prevent="register()">register</button>
        </form>
	</div>
</template>

<script>

import eventBus from '../global-events';
import { ScreepsAPI } from '../scripts/screepsAPI';

export default {
  data() {
  	return {
      host: window.location.hostname,
      port: window.location.port,
      secure: window.location.protocol === 'https:',
  		username: '',
  		email: '',
  		password: '',
  	}
  },

  methods: {
  	async register() {
      if (eventBus.api) eventBus.api.disconnect();
      if (eventBus.client) eventBus.client.disconnect();

      eventBus.api = new ScreepsAPI({
          host: this.host,
          port: this.port,
          secure: this.secure,

          email: this.email,
          password: this.password,
        });

      let res = await eventBus.api.register(this.username, this.email, this.password);
      if (res.ok) {
      	eventBus.api = api;

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
		eventBus.client.connect();
      }
  	}
  }
}
</script>

<style>

</style>