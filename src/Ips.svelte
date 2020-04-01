<script>
    import api from './api'
    import { beforeUpdate } from 'svelte';
    export let nameApp = null
    let ips = []
    let newIp = null
    let nrFiles = null
    let oldName = null
    let exportData = []
    let ipTablesClass = 'table-wrapper-scroll-y my-custom-scrollbar collapse show'
    let editorClass = ''
    
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
        await api.post('/remove/ip', {
            app: nameApp,
            ip: ip
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
            newIp = ''
            await list()
        }
      } catch (err) {
        console.log(`erro`, err)
      }
    }
    async function downloadFiles () {
      ipTablesClass = 'collapse'

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
      editorClass = 'show'
    }
    function removeFiles () {
      ipTablesClass = 'table-wrapper-scroll-y my-custom-scrollbar collapse show'
      editorClass = ''
    }
    beforeUpdate(() => {
      if (nameApp !== null && nameApp !== '' && oldName !== nameApp) {
          // console.log(`new name app`, nameApp)
          oldName = nameApp
          list()
      }
    })
</script>
<style>
.my-custom-scrollbar {
position: relative;
height: 600px;
overflow: auto;
}
.table-wrapper-scroll-y {
display: block;
}
</style>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Ips do Aplicativo</h1>
</div>
<div class="row p-3">
    <div class="col-md-6">
        <p>Adicionar novo Ip para o app</p>
        <input bind:value={newIp} />
        <button type="button" on:click={addIp} class="btn btn-info">Adicionar</button>
    </div>
    <div class="col-md-6">
        <p>Qtde Ips por arquivo: </p>
        <input bind:value={nrFiles} />
        <button type="button" on:click={downloadFiles} class="btn btn-info">Gerar</button>
    </div>
</div>
<div id="editor-ips" class="collapse {editorClass}">
  {#if exportData}
    <table class="table table-striped table-sm">
        <thead>
        <tr>
            <th>Arquivos</th>
        </tr>
        </thead>
        <tbody>
            {#each exportData as data, i}
            <tr>
                <td>
                  <a href={data} download="data_{nameApp}_conjunto_{i}.json">data_{nameApp}_conjunto_{i}.json</a>
                </td>
            </tr>
            {/each}
            <tr>
              <td>
                 <button type="button" on:click={removeFiles} class="btn btn-info">Finalizar arquivos</button>
              </td>
            </tr>
        </tbody>
    </table>
    <div class="row">
        
    </div>
  {/if}
</div>
<div id="table-ips" class="table-responsive {ipTablesClass}">
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