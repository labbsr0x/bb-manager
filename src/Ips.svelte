<script>
    import api from './api'
    import { beforeUpdate } from 'svelte';
    export let nameApp = null
    let ips = []
    let newIp = null
    let nrFiles = null
    let oldName = null
    let exportData = []
	async function list() {
		try {
			let response = await api.get(`/listIps/${nameApp}`)
			// console.log(`response ips`, response)
			ips = response.data.result
		} catch (err) {
			console.log(`erro`, err)
		}
    }
    async function deleteIp(ip) {
        try {
			// let response = await api.get(`/listIps/${nameApp}`)
            // console.log(`delete ip`, ip)
            await api.post('/remove/ip', {
                app: nameApp,
                ip: ip
            })
            await list()
			// ips = response.data.result
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
                let response = null
                if (hasIps.length > 1) {
                    let requests = hasIps.map(i => api.post('/add/ip', {
                        app: nameApp,
                        ip: i
                    }))
                    response = await Promise.all(requests)
                } else {
                    response = await api.post('/add/ip', {
                        app: nameApp,
                        ip: newIp
                    })
                }
                
                // console.log('response add ip', response)
                newIp = ''
                await list()
            }
			// ips = response.data.result
		} catch (err) {
			console.log(`erro`, err)
		}
    }
    async function downloadFiles () {
        // console.log('Download')
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
            oldName = nameApp
            list()
        }
    })
</script>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dados</h1>
</div>
<div class="row p-3">
    <div class="col-md-6">
        <p>Adicionar novo Ip para o app: {nameApp}</p>
        <input bind:value={newIp} />
        <button type="button" on:click={addIp} class="btn btn-info">Adicionar</button>
    </div>
    <div class="col-md-6">
        <p>Qtde Ips por arquivo: </p>
        <input bind:value={nrFiles} />
        <button type="button" on:click={downloadFiles} class="btn btn-info">Gerar</button>
    </div>
</div>
<div class="table-responsive">
    <table class="table table-striped table-sm">
        <thead>
        <tr>
            <th>Ip</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
            {#each ips as ip, i}
                <tr>
                <td>{ip}</td>
                <td>
                    <button type="button" on:click={deleteIp(ip)} class="btn btn-info">Delete</button>
                </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
{#if exportData}
    <div class="row">
        {#each exportData as data, i}
            <div class="col-md-12">
                <a href={data} download="data_{nameApp}_conjunto_{i}.json">Arquivo data_{nameApp}_conjunto_{i}.json</a>
            </div>
        {/each}
    </div>
{/if}