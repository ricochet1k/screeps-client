<template>
	<div>
		<form @submit.prevent="login()">
          <div>
          	<label for="host">host:</label>
            <input id="host" v-model="auth.host" />
          </div>
          <div>
            <label for="port">port:</label>
            <input id="port" v-model="auth.port" />
          </div>
          <div>
            <label for="secure">secure:</label>
            <input id="secure" v-model="auth.secure" type="checkbox" />
          </div>
          <div>
            <label for="username">username:</label>
            <input id="username" v-model="auth.username" />
          </div>
          <div>
            <label for="email">email:</label>
            <input id="email" v-model="auth.email" />
          </div>
          <div>
            <label for="password">password:</label>
            <input id="password" v-model="auth.password" type="password" />
          </div>

          <button @click.prevent="login()">login</button>
        </form>
        <div class="steam-auth" @click.prevent="externalauth('steam')"></div>
        <div class="github-auth" @click.prevent="externalauth('github')"></div>
	</div>
</template>

<script>

import eventBus from '../global-events';
import auth from '../auth';
import { ScreepsAPI } from '../scripts/screepsAPI';

export default {
  data() {
  	return {
      auth,
    }
  },

  mounted() {
    if (this.$route.query.token)
      auth.externalConnect(this.$route.query.token);
    if (this.$route.query.auto && auth.password)
      this.login();

      this.$watch(() => eventBus.api, api => {
        if (!api) return;
        console.log('API changed', api);
        if (this.$route.query.backto){
          this.$router.replace(this.$route.query.backto);
        } else {
          this.$router.replace('/');
        }
      })
  },

  methods: {
  	login() {
      auth.connect();
  	},
    externalauth(which) {
      // let ret = "//" + auth.host + ":" + auth.port + "/" + window.location.path + "#/login";
      window.open("//" + auth.host + ":" + auth.port + "/api/auth/" + which);
      //+ "?return=" + encodeURIComponent(ret)
    }
  }
}
</script>

<style>
.github-auth {
  width: 50px;
  height: 50px;
  display: inline-block;
  background: black url(https://screeps.com/a/components/login/github4.svg);
  background-size: cover !important;
  cursor: pointer;
}
.steam-auth {
  width: 50px;
  height: 50px;
  display: inline-block;
  background: black url(https://screeps.com/a/components/login/steam.svg);
  background-size: cover !important;
  cursor: pointer;
}
</style>