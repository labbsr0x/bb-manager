<script>
	import Kitchen from '@smui/snackbar/kitchen/index';
	import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
	import Button, {Label} from '@smui/button';
	import IconButton, {Icon} from '@smui/icon-button';
	import { navigate } from "svelte-routing";
	import { appName } from './store/app.js';
	import { dataId } from './store/form.js';
	import api from './api/'
	let apps = []
	let kitchen
	const appURL = '/app'
	api.get(appURL).then(response => {
		// console.log(`response`, response)
		apps = response.data.result
	}).catch(error => {
		console.debug(`error`, error)
		kitchen.push({
			props: {
				variant: 'stacked'
			},
			label: 'Ocorreu um erro na listagem dos aplicativos'
		})
	})
	const updateApps = async () => {
		try {
			let response = await api.get(appURL)
			apps = response.data.result
		} catch (err) {
			console.debug(`erro`, err)
			kitchen.push({
				props: {
					variant: 'stacked'
				},
				label: 'Ocorreu um erro na listagem dos aplicativos'
			})
		}
	}
	const listIps = async (app) => {
		appName.update(t => app)
		navigate(`ips`)
	}
	const listVersions = async (app) => {
		navigate(`versions/${app}`)
	}
	const newApp = () => {
		navigate(`new/app`)
	}
	const editApp = (app) => {
		console.log('edit app', app)
		dataId.update(t => app)
		navigate(`edit/app`)
	}
	const deployPage = (app) => {
		appName.update(t => app)
		navigate(`deploy/app`)
	}

	const deleteApp = async (app) => {
		try {
			await api.delete(`/app?name=${app}`)
			kitchen.push({
				props: {
					variant: 'stacked'
				},
				label: 'Aplicativo excluido com sucesso.'
			})
			await updateApps()
			// console.log(`response on update`, response)
		} catch (err) {
			kitchen.push({
				props: {
					variant: 'stacked'
				},
				label: 'Ocorreu um erro e não foi possível excluir o aplivativo'
			})
			console.log(`erro`, err)
		}
	}

	const getIngressStatus = async (app) => {
		let basicName = app._name.split('-')
		basicName.shift()
		basicName = basicName.join('-')
		const promsterUrl = `http://${basicName}-promster.${process.env.BB_MANAGER_DNS_EXTENSION}/api/v1/targets`
		const res = await api.get(promsterUrl)
		if (res.status === 200 ) {
			return 'done'
		} else {
			throw new Error(error);
		}
	}
</script>
<div class="row mt-5">
  <Button type="button" on:click={newApp} class="btn btn-info">
    <Label>Criar nova aplicação</Label>
  </Button>
</div>
<div style="display: flex; flex-wrap: wrap;">
  {#each apps as app, i}
    <div class="card-container">
      <Card style="width: 360px;">
        <Content class="mdc-typography--body2">
          <h2 class="mdc-typography--headline6" style="margin: 0;">
			{#await getIngressStatus(app)}
				<p>...waiting</p>
			{:then icon}
				<span style="color: green">
					<Icon class="material-icons">{icon}</Icon>
				</span>
			{:catch error}
				<span style="color: red">
					<Icon class="material-icons">highlight_off</Icon>
				</span>
			{/await}
			{app._name}</h2>
          <div class="card-internal">
            {app._desc}
          </div>
        </Content>
        <Actions>
          <ActionButtons>
            <IconButton color="primary" on:click={listIps(app._name)}>
							<Icon class="material-icons">computer</Icon>
            </IconButton>
            <IconButton color="primary" on:click={listVersions(app._name)}>
							<Icon class="material-icons">history</Icon>
            </IconButton>
						<IconButton color="primary" on:click={editApp(app._name)}>
              <Icon class="material-icons">edit</Icon>
            </IconButton>
            <IconButton color="primary" on:click={deleteApp(app._name)}>
							<Icon class="material-icons">remove_circle</Icon>
            </IconButton>
						<IconButton color="primary" on:click={deployPage(app._name)}>
							<Icon class="material-icons">restore_page</Icon>
			</IconButton>
          </ActionButtons>
        </Actions>
      </Card>
    </div>
  {/each}
</div>
<Kitchen bind:this={kitchen} dismiss$class="material-icons" />
<style>
  .card-container {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 380px;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 20px;
  }
  .card-internal {
    margin-top: 8px;
  }
</style>