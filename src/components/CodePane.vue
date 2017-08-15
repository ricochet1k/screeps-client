<template>
	<div class="codepane">
		<button @click.prevent="save()">Save</button>
		<codemirror 
			ref="editor"
			v-model="code"
			:options="editorOptions"
		></codemirror>

	</div>
</template>

<script>
import eventBus from '../global-events';
import VueCodemirror from 'vue-codemirror';

export default {
	data() {
		return {
			code: '',
			editorOptions: {
				theme: 'monokai',
				lineNumbers: true,
				line: true,

				// keyMap: "sublime",
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

				styleSelectedText: true,
				highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
			}
		}
	},
	mounted() {
		if (eventBus.api)
			this.load();
		else
			this.$watch(function() { return eventBus.api }, api => {
				console.log('api', api);
				if (eventBus.api)
					setTimeout( () => this.load(), 1000);
			})
	},
	methods: {
		async load() {
			let r = await eventBus.api.code('default');
			console.log('code', r);
			let {modules} = r;
			this.code = modules.main;
		},
		save() {
			eventBus.api.setCode('default', {main: this.code});
		}
	},
	components: {
		codemirror: VueCodemirror.codemirror,
	}
}
</script>

<style>
.codepane {
	height: 100%;
}
.codepane .CodeMirror {
	height: 100%;
}
</style>