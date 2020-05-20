<script>
  import { onMount } from 'svelte';
  import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
  import Button, {Label} from '@smui/button';
  import { navigate } from "svelte-routing";
  import SettingsForm from './SettingsForm.svelte'
  import api from '../api/'
  export let form = null
  let dataForm = {}
  let forms = [
    {
      name: 'settings',
      title: 'Configurações',
      component: 'SettingsForm',
      url: '/settings',
      back: '/settgins'
    }
  ]

  let selected = {}

  onMount(() => {
    selected = forms.find(element => element.name === form)
    if (selected === null || selected === undefined || !Object.keys(selected)) {
      navigate(`/`)
    }
  })

  const saveData = async () => {
    try {
      console.log('data', dataForm)
      await api.post(selected.url, dataForm)
      navigate(`${selected.back}`)
    } catch (err) {
      open = true
      console.log(`erro`, err)
    }
  }
  const cancel = async () => {
    navigate(`/`)
  }
</script>
<style>

</style>
<Card>
  <Content class="mdc-typography--body2" style="max-width: 60%;">
    <h2 class="mdc-typography--headline6" style="margin: 0;">Cadastro de {'title' in selected ? selected.title : ''}</h2>
    <div class="row">
      {#if form === 'settings'}
        <SettingsForm data={dataForm} />
      {/if}
    </div>
  </Content>
  <Actions>
    <ActionButtons>
      <Button color="primary" on:click={cancel}>
        <Label>Cancelar</Label>
      </Button>
      <Button color="primary" on:click={saveData}>
        <Label>Salvar</Label>
      </Button>
    </ActionButtons>
  </Actions>
</Card>