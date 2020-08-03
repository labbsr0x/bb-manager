<script>
	import TitleList from '../TitleList.svelte'
	import IconButton, {Icon} from '@smui/icon-button';
	import Button, {Group, GroupItem, Label} from '@smui/button';
	import HelperText from '@smui/textfield/helper-text/index';
	import Textfield, {Input} from '@smui/textfield'
	import { appName } from '../store/app.js';
	import api from '../api'
	import { beforeUpdate } from 'svelte';
	export const location = ''
	let nameApp;
	let ips = []
	let newIp = ''
	let nrFiles = ''
	let oldName = null
	let exportData = null

	const unsubscribe = appName.subscribe(value => {
		nameApp = value;
	})
		
	const deployKB = async () => {
		console.log('app', nameApp)
		try {
			let response = await api.post('/kb/deploy/promster', {
				name: nameApp,
				option: 'text'
			})
			exportData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data.result));
		} catch (err) {
			console.log(`erro`, err)
		}
	}
</script>
<TitleList title="Deploy Prometheus" />
<div class="row">
    <IconButton color="primary" on:click={deployKB(nameApp)}>
			<Icon class="material-icons">input</Icon>
		</IconButton>
		<IconButton color="primary" on:click={deployKB(nameApp)}>
			<Icon class="material-icons">input</Icon>
		</IconButton>
</div>
<div class="row p-3">
	{#if exportData}
		<a href={exportData} download="promster.yaml">Download arquivo</a>
	{/if}
</div>