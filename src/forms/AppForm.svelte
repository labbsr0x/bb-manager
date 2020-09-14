<script>
	import { onMount } from 'svelte';
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import Select, {Option} from '@smui/select';
	import List, {Group, Item, Graphic, Meta, Label, Separator, Subheader, Text, PrimaryText, SecondaryText} from '@smui/list';
	import Button, {Icon} from '@smui/button';
	import Textfield, {Input, Textarea} from '@smui/textfield'
	import HelperText from '@smui/textfield/helper-text/index'
	import FloatingLabel from '@smui/floating-label';
	import NotchedOutline from '@smui/notched-outline';
	import { navigate } from "svelte-routing";
	import { beforeUpdate, afterUpdate } from 'svelte';
	import api from '../api/'
	export let data = {}
	export let edit = false
	let namespace = ''
	let desc = ''
	let name = ''
	let scrapePath = []
	let auxScrapePath = ''
	let ips = []
	let scheme = 'http'
	let tls = false
let allSettings = []
let schemes = ['https', 'http']
	let level = 1
	let levels = [
		1, 2, 3, 4
	];

	$: {
		data.namespace = namespace
		data.desc = desc
		data.name = name
		data.scrapePath = scrapePath
		data.ips = ips
		data.scheme = scheme
		data.tls = tls
		data.level = level
	}

	let deletePath = (path) => {
		const index = scrapePath.indexOf(path)
		if (index > -1) {
			scrapePath.splice(index, 1)
			scrapePath = [...scrapePath]
		}
	}

	let addPath = () => {
		const index = scrapePath.indexOf(auxScrapePath)
		if (index === -1) {
			scrapePath = [...scrapePath, auxScrapePath]
			auxScrapePath = ''
		}
	}

	async function listSettings() {
		try {
			let response = await api.get('/settings')
			allSettings = response.data.result.map(e => e._namespace)
		} catch (err) {
			console.log('err list Settings', err)
		}
	}
	beforeUpdate(() => {
		console.log('teste')
	})
	onMount(async () => {
		await listSettings()
		console.log('data on app form on mount', data)
		if (!Object.keys(data)) {
			data = {
				namespace: '',
				desc: '',
				name: '',
				scrapePath: [],
				ips: [],
				scheme: '',
				tls: false,
				level: 1
			}
		} else {
			namespace = data._namespace || data.namespace
			desc = data._desc || data.desc
			name = data._name || data.name
			scrapePath = data._scrapePath || data.scrapePath
			ips = data._ips || data.ips
			scheme = data._scheme || data.scheme
			tls = data._tls || data.tls
			level = data._level || data.level
		}
		
		console.log('data on app form on mount', data)
	})
	
</script>
<style>
  .component {
    margin: 12px;
  }
  * :global(select, .demo-select-width) {
    min-width: 200px;
    width: 100%;
  }
</style>
<div class="row">
  <div class="col-12 component">
	  <Textfield disabled={edit} fullwidth bind:value={name} label="Nome do aplicativo" />
  </div>
  <div class="col-12 component">
    <Select class="demo-select-width" bind:value={level} label="Nível"  menu$class="demo-select-width">
      <Option value=""></Option>
      {#each levels as l}
        <Option value={l} selected={l === level}>{l}</Option>
      {/each}
    </Select>
  </div>
  <div class="col-12 component">
    <Select class="demo-select-width" bind:value={namespace} label="Settings" menu$class="demo-select-width">
      <Option value=""></Option>
      {#each allSettings as setting}
        <Option value={setting} selected={namespace === setting}>{setting}</Option>
      {/each}
    </Select>
  </div>
  <div class="col-12 component">
    <Select class="demo-select-width" bind:value={scheme} label="Scheme" menu$class="demo-select-width">
      <Option value=""></Option>
      {#each schemes as schem}
        <Option value={schem} selected={schem === scheme}>{schem}</Option>
      {/each}
    </Select>
  </div>
  <div class="col-12 component">
    <FormField>
      <Switch bind:checked={tls} />
      <span slot="label">Tls</span>
    </FormField>
  </div>
  <div class="col-12 component">
    <Textfield fullwidth textarea>
      <Textarea bind:value={desc} id="input-manual-d" aria-controls="helper-text-manual-d" aria-describedby="helper-text-manual-d" />
      <NotchedOutline>
        <FloatingLabel for="input-manual-d">Descrição do aplicativo</FloatingLabel>
      </NotchedOutline>
    </Textfield>
  </div>
  <div class="col-12 component">
    <div class="row">
      <Textfield label="Scrape Paths">
        <Input bind:value={auxScrapePath} id="input-manual-c" aria-controls="helper-text-manual-c" aria-describedby="helper-text-manual-c" />
        <Button on:click={addPath} color="primary">
          <Icon class="material-icons">add_box</Icon>
        </Button>
      </Textfield>
    </div>
    <div class="row component">
      <p>
        Urls de scrape:
      </p> 
      {#if scrapePath.length}
        <List>
          {#each scrapePath as scrape, i}
            <Item>
              <Label>{scrape}</Label>
              <Meta>
                <Button color="secondary" on:click={deletePath(scrape)}>
                  <Graphic class="material-icons">delete</Graphic>
                </Button>
              </Meta>
            </Item>
          {/each}
        </List>
      {:else}
        Nenhuma url cadastrada
      {/if}
    </div>
  </div>
</div>