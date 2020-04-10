<script>
  import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
  import Button, {Label} from '@smui/button';
  import { navigate } from "svelte-routing";
	import api from './api/'
	let apps = []
	api.get(`/listApps?descApp=true`).then(response => {
		// console.log(`response`, response)
		apps = response.data.result
	}).catch(error => {
		console.log(`error`, error)
	})
	const updateApps = async () => {
		try {
			let response = await api.get('/listApps?descApp=true')
			console.log(`response on update`, response)
			apps = response.data.apps
		} catch (err) {
			console.log(`erro`, err)
		}
	}
	const listIps = async (app) => {
		navigate(`ips/${app}`)
  }
  const newApp = () => {
    navigate(`newApp`)
  }
  const deleteApp = async (app) => {
    try {
			await api.post('/removeApp', {
        name: app
      })
      await updateApps()
			// console.log(`response on update`, response)
		} catch (err) {
			console.log(`erro`, err)
		}
  }
</script>

<div style="display: flex; flex-wrap: wrap;">
  {#each apps as app, i}
    <div class="card-container">
      <Card style="width: 360px;">
        <PrimaryAction>
          <Content class="mdc-typography--body2">
            <h2 class="mdc-typography--headline6" style="margin: 0;">{app.app}</h2>
            {app.desc}
          </Content>
        </PrimaryAction>
        <Actions>
          <ActionButtons>
            <Button on:click={listIps(app.app)}>
              <Label>Máquinas</Label>
            </Button>
            <Button on:click={deleteApp(app.app)}>
              <Label>Versões</Label>
            </Button>
            <Button on:click={deleteApp(app.app)}>
              <Label>Excluir</Label>
            </Button>
          </ActionButtons>
        </Actions>
      </Card>
    </div>
  {/each}
</div>
<div class="row mt-5">
  <Button type="button" on:click={newApp} class="btn btn-info">
    <Label>Criar nova aplicação</Label>
  </Button>
</div>

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
</style>