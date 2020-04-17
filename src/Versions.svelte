<script>
    import Select, {Option} from '@smui/select';
    import TitleList from './TitleList.svelte'
    import List, {Item, Graphic, Meta, Label} from '@smui/list';
    import Button, {Icon} from '@smui/button';
    import HelperText from '@smui/textfield/helper-text/index';
    import Textfield, {Input} from '@smui/textfield'
    import { navigate } from "svelte-routing";
    import api from './api'
    import { beforeUpdate } from 'svelte';
    export let nameApp = null
    export const location = ''
    let versions = []
    let newVersion = ''
    let oldName = null
    let envData = ['piloto', 'prod']
    let envChoice = ''
    
    async function list() {
      try {
        let response = await api.get(`/list/version/${nameApp}`)
        // console.log(`response ips`, response)
        versions = response.data.result
        console.log('ips', versions)
      } catch (err) {
        console.log(`erro`, err)
      }
    }
    async function deleteVersion(environment, version) {
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
    async function addVersion() {
      try {
        await api.post('/add/version', {
            app: nameApp,
            env: envChoice,
            version: newVersion
        })
        newVersion = ''
        envChoice = ''
        await list()
      } catch (err) {
        console.log(`erro`, err)
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
<TitleList title="Versões do Aplicativo" />
<div class="row">
    <div class="col-md-4">
      <Select enhanced style="width: -webkit-fill-available;" bind:value={envChoice} label="Plataforma">
        {#each envData as environment}
          <Option value={environment} selected={envChoice === environment}>{environment}</Option>
        {/each}
      </Select>
    </div>
    <div class="col-md-4 offset-md-1">
      <Textfield label="Version">
        <Input bind:value={newVersion} id="versionInput" aria-controls="helper-version-input" aria-describedby="helper-version-input" />
      </Textfield>
      <HelperText id="helper-version-input">Versão do app</HelperText>
    </div>
    <div class="col-md-2">
      <Button on:click={addVersion} color="primary">
        <Icon class="material-icons">add_box</Icon>
      </Button>
    </div>
</div>
<div class="row p-3">
  <List>
      {#each Object.keys(versions) as environment, i}
        <Item>
          <Label style="width: 100%;">
            <div class="row">
              <div class="col-6">
                {environment}
              </div>
              <div class="col-6">
                {versions[environment]}
              </div>
            </div> 
          </Label>
          <Meta>
            <Button color="secondary" on:click={deleteVersion(environment, versions[environment])}>
              <Graphic class="material-icons">delete</Graphic>
            </Button>
          </Meta>
        </Item>
      {/each}
    </List>
</div>