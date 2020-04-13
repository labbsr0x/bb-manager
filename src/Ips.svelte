<script>
    import IPList from './machines/IPList.svelte'
    import FileList from './machines/FileList.svelte'
    import Button, {Group, GroupItem, Label, Icon} from '@smui/button';
    import HelperText from '@smui/textfield/helper-text/index';
    import Textfield from '@smui/textfield'
    import api from './api'
    import { beforeUpdate } from 'svelte';
    export let nameApp = null
    export let location = ''
    let ips = []
    let newIp = ''
    let nrFiles = ''
    let oldName = null
    let exportData = []
    
    async function list() {
      try {
        let response = await api.get(`/listIps/${nameApp}`)
        // console.log(`response ips`, response)
        ips = response.data.result
        console.log('ips', ips)
      } catch (err) {
        console.log(`erro`, err)
      }
    }
    async function deleteIp() {
      try {
        await api.post('/remove/ip', {
            app: nameApp,
            ip: event.detail.ip
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
<div class="row p-3">
    <h1 class="h2">Ips do Aplicativo</h1>
    <div class="col-md-4">
        <Textfield bind:value={newIp} label="IP">
        </Textfield>
        <HelperText validationMsg>Endereço da máquina a ser adicionada.</HelperText>
        <Button on:click={addIp} color="secondary">
          <Icon class="material-icons">add_box</Icon>
        </Button>
    </div>
    <div class="col-md-4">
        <Textfield bind:value={nrFiles} label="Qtde Ips por arquivo:" />
        <HelperText validationMsg>Número de máquinas por arquivo.</HelperText>
        <Button on:click={downloadFiles} color="secondary">
          <Icon class="material-icons">cloud_download</Icon>
        </Button>
    </div>
</div>
<div class="row p-3">
  <FileList files={exportData} nameApp={nameApp} />
  <IPList ips={ips} on:handleDelete={deleteIp} />
</div>