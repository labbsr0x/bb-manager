<script>
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

<div class="row">
  {#each apps as app, i}
    <div class="card col-5 mx-2 my-2 bg-grey">
      <div class="card-body">
        <h5 class="card-title" style="color: grey">
          <span data-feather="home">{app.app}</span>
        </h5>
        <div class="card-text row">
          <span class="col-12" style="color: grey">{app.desc}</span>
          <div class="col-12 mx-2 my-2">
            <button class="btn btn-primary" on:click={listIps(app.app)}>Máquinas</button>
            <button class="btn btn-success" on:click={deleteApp(app.app)}>Versões</button>
            <button class="btn btn-danger" on:click={deleteApp(app.app)}>Remover</button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
<div class="row mt-5">
  <button type="button" on:click={newApp} class="btn btn-info">Criar nova aplicação</button>
</div>