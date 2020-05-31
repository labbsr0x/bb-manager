<script>
	import { onMount } from 'svelte';
	import List, {Group, Item, Graphic, Meta, Label, Separator, Subheader, Text, PrimaryText, SecondaryText} from '@smui/list';
	import Button, {Icon} from '@smui/button';
	import Textfield, {Input, Textarea} from '@smui/textfield'
	import HelperText from '@smui/textfield/helper-text/index'
	import FloatingLabel from '@smui/floating-label';
	import NotchedOutline from '@smui/notched-outline';
	import { navigate } from "svelte-routing";
	import api from '../api/'
	export let data = {}
	let namespace = ''
	let desc = ''
	let name = ''
	let scrapePath = []
	let auxScrapePath = ''
	let ips = []

	$: {
		data.namespace = namespace
		data.desc = desc
		data.name = name
		data.scrapePath = scrapePath
		data.ips = ips
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
		console.log('index', index)
		if (index === -1) {
			scrapePath = [...scrapePath, auxScrapePath]
			console.log('scrape path', scrapePath)
			auxScrapePath = ''
		}
	}

	onMount(() => {
		console.log('data', data)
		if (!Object.keys(data)) {
			data = {
				namespace: '',
				desc: '',
				name: '',
				scrapePath: [],
				ips: [],
			}
		}
	})
	
</script>
<style>

</style>
<div class="row">
	<Textfield bind:value={name} label="Nome do aplicativo" />
	<Textfield bind:value={namespace} label="Namespace" />
	<Textfield textarea>
		<Textarea bind:value={desc} id="input-manual-d" aria-controls="helper-text-manual-d" aria-describedby="helper-text-manual-d" />
		<NotchedOutline>
			<FloatingLabel for="input-manual-d">Descrição do aplicativo</FloatingLabel>
		</NotchedOutline>
	</Textfield>
	<Textfield label="Scrape Paths">
		<Input bind:value={auxScrapePath} id="input-manual-c" aria-controls="helper-text-manual-c" aria-describedby="helper-text-manual-c" />
		<Button on:click={addPath} color="primary">
			<Icon class="material-icons">add_box</Icon>
		</Button>
	</Textfield>
	{#if scrapePath.length}
    Urls de scrape: 
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