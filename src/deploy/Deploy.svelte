<script>
	import TitleList from '../TitleList.svelte'
	import IconButton, {Icon} from '@smui/icon-button';
	import Button, {Group, GroupItem, Label} from '@smui/button';
	import HelperText from '@smui/textfield/helper-text/index';
	import Textfield, {Input, Textarea} from '@smui/textfield'
	import { appName } from '../store/app.js';
	import api from '../api'
	import { beforeUpdate } from 'svelte';
	let nameApp;
	let ips = []
	let newIp = ''
	let nrFiles = ''
	let oldName = null
	let exportData = null
	let text = ''
	let requirements = ''


	const unsubscribe = appName.subscribe(value => {
		nameApp = value;
	})
	async function list() {
		try {

			let response = await api.get(`/app?name=${nameApp}`)
			// console.log(`response ips`, response)
			let fullApp = response.data.result
			let settings = null
			if (fullApp._namespace) {
				let responseSettings = await api.get(`/settings/${fullApp._namespace}`)
				settings = responseSettings.data.result
			}
			let basicName = fullApp._name.replace('/services', '').split('-')
			basicName.shift()
			basicName = basicName.join('-')
			const envApp = fullApp._name.replace('/services', '').split('-')[1]
			text = `
${basicName}:
  generator:
	deploy: false
	service: ${fullApp._name.replace('/services', '')}

  promster:
	image: ${settings._dockerImage}
	tag: ${settings._dockerTag}
	prefix: ${fullApp._name.replace('/services', '')}
	deploy: true
	scrapePaths: ${fullApp._scrapePath.join()}
	scheme: ${fullApp._scheme}
	tls: ${fullApp._tls ? "true" : "false"}
	ingress: 
		enabled: true
		hostname: ${basicName}-promster.${process.env.BB_MANAGER_DNS_EXTENSION}
		`
			requirements = `
- name: big-brother
  version: ${process.env.BB_MANAGER_CHART_VERSION}
  alias: ${basicName}
  repository: ${process.env.BB_MANAGER_CHART_URL}
`
		} catch (err) {
			console.log(`erro`, err)
		}
	}
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
	const copyToClipBoard = () => {
		document.execCommand("copy")
	}
	beforeUpdate(() => {
		if (nameApp !== null && nameApp !== '' && oldName !== nameApp) {
			// console.log(`new name app`, nameApp)
			console.log('name app', nameApp)
			oldName = nameApp
			list()
		}
	})
</script>
<TitleList title="Deploy Prometheus" />
<div class="row">
	<div>Values.yaml</div>
	<div class="margins">
		<Textfield textarea fullwidth input$aria-controls="helper-text-fullwidth-textarea" >
			<Textarea bind:value={text} rows="20" id="input-manual-d" aria-controls="helper-text-manual-d" aria-describedby="helper-text-manual-d" />
		</Textfield>
	</div>
	<div>Requeriments.yaml</div>
	<div class="margins">
		<Textfield textarea fullwidth input$aria-controls="helper-text-fullwidth-textarea" >
			<Textarea bind:value={requirements} rows="10" id="input-manual-d" />
		</Textfield>
    </div>
</div>
<div class="row p-3">
	{#if exportData}
		<a href={exportData} download="promster.yaml">Download arquivo</a>
	{/if}
</div>
<style>
  .margins {
    margin: 18px 0 24px;
  }
</style>