
import Vue from 'vue';

let eventBus = new Vue({
	data: function() {
		return {
			api: null,
			client: null,
		}
	}
});

export default eventBus;

window.eventBus = eventBus;
