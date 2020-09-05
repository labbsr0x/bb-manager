<script>
	import { onMount } from 'svelte';
	import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
	import Button, {Label} from '@smui/button';
	import { navigate } from "svelte-routing";
	import SettingsForm from './SettingsForm.svelte'
	import AppForm from './AppForm.svelte'
	import { dataId } from '../store/form.js';
	import api from '../api/'
	export let form = null
	export let location
	let dataForm = {}
	let id = ''
	let loading = true
	let edit = false
	let forms = [
		{
			name: 'settings',
			title: 'Configurações',
			component: 'SettingsForm',
			url: '/settings',
			back: '/settings',
			uniqueField: 'namespace'
		},
		{
			name: 'app',
			title: 'Aplicações',
			component: 'AppForm',
			url: '/app',
			back: '/apps',
			uniqueField: 'name'
		}
	]

	let selected = {}

	const unsubscribe = dataId.subscribe(value => {
		id = value;
	})

	console.log('passou aqui', form)
	onMount(async () => {
		loading = true
		selected = forms.find(element => element.name === form)
		console.log('selected', selected, form)
		if (selected === null || selected === undefined || !Object.keys(selected)) {
			navigate(`/`)
		}
		console.log('id', id)
		console.log('location', id, location)
		if (location.pathname.includes('edit') && id) {
			edit = true
			await findData()
		}
		loading = false
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
	const editData = async () => {
		try {
			console.log('data on edit', dataForm)
			await api.put(selected.url, dataForm)
			navigate(`${selected.back}`)
		} catch (err) {
			open = true
			console.log(`erro`, err)
		}
	}
	const findData = async () => {
		try {
			let response = await api.get(`${selected.url}?${selected.uniqueField}=${id}`, dataForm)
			dataForm = response.data.result
			console.log('data form in find', dataForm)
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
	{#if !loading}
  <Content class="mdc-typography--body2" style="max-width: 60%;">
    <h2 class="mdc-typography--headline6" style="margin: 0;">Cadastro de {'title' in selected ? selected.title : ''}</h2>
    <div class="row">
      {#if form === 'settings'}
        <SettingsForm data={dataForm} />
			{:else if form === 'app'}
				<AppForm data={dataForm} edit={edit}/>
      {/if}
    </div>
  </Content>
  <Actions>
    <ActionButtons>
      <Button color="primary" on:click={cancel}>
        <Label>Cancelar</Label>
      </Button>
			{#if !edit}
				<Button color="primary" on:click={saveData}>
        	<Label>Salvar</Label>
     		</Button>
			{:else}
				<Button color="primary" on:click={editData}>
        	<Label>Editar</Label>
     		</Button>
      {/if}
      
    </ActionButtons>
  </Actions>
	{/if}
</Card>