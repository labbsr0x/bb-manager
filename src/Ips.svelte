<script>
	import IPList from './machines/IPList.svelte'
	import FileList from './machines/FileList.svelte'
	import TitleList from './TitleList.svelte'
	import Button, {Group, GroupItem, Label, Icon} from '@smui/button';
	import HelperText from '@smui/textfield/helper-text/index';
	import Textfield, {Input} from '@smui/textfield'
	import { appName } from './store/app.js';
	import api from './api'
	import { beforeUpdate } from 'svelte';
	export const location = ''
	let nameApp;
	let ips = []
	let newIp = ''
	let nrFiles = ''
	let oldName = null
	let exportData = []

	const unsubscribe = appName.subscribe(value => {
		nameApp = value;
	})

	async function list() {
		try {
			let response = await api.get(`/app?name=${nameApp}`)
			// console.log(`response ips`, response)
			ips = response.data.result._ips
		} catch (err) {
			console.log(`erro`, err)
		}
	}
	async function deleteIp(event) {
		try {
			await api.delete('/app/ip', {
				name: nameApp,
				ips: event.detail.ip
			})
			await list()
		} catch (err) {
			console.log(`erro`, err)
		}
	}
	async function addIp() {
		try {
			// let response = await api.get(`/listIps/${nameApp}`)
			// console.log("adicionar novo ip")
			if (newIp !== null && newIp !== '' && newIp !== undefined) {
				let hasIps = newIp.split(",").map(o => o.replace(/\"/g, ""))
				hasIps = hasIps.filter(i => i !== "" && i !== null && i !== undefined)
				// console.log(`has ips`, hasIps)
				console.log("nameApp", nameApp)
				let response = null
				if (hasIps.length > 1) {
					let requests = hasIps.map(i => api.patch('/app/ip', {
						name: nameApp,
						ips: i
					}))
					response = await Promise.all(requests)
				} else {
					response = await api.patch('/app/ip', {
						name: nameApp,
						ips: newIp
					})
				}
				newIp = ''
				await list()
			}
		} catch (err) {
			console.log(`erro`, err)
		}
	}
	async function downloadFiles () {

		let copyIps = [...ips]
		for (let i = 0; i < ips.length / nrFiles; i++) {
			let json = [
				{
					"targets": copyIps.slice(0, nrFiles),
					"labels": {}
				}
			]
			copyIps = copyIps.slice(nrFiles)
			exportData[i] = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
		}
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
<TitleList title="Máquinas do Aplicativo" />
<div class="row">
    <div class="col-md-5">
      <Textfield label="IP">
        <Input bind:value={newIp} id="input-manual-c" aria-controls="helper-text-manual-c" aria-describedby="helper-text-manual-c" />
        <Button on:click={addIp} color="primary">
          <Icon class="material-icons">add_box</Icon>
        </Button>
      </Textfield>
      <HelperText id="helper-text-manual-c">Ip da máquina</HelperText>
    </div>
</div>
<div class="row p-3">
  <FileList files={exportData} nameApp={nameApp} />
  <IPList ips={ips} on:handleDelete={deleteIp} />
</div>