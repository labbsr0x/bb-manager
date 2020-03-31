<script>
  import { navigate } from "svelte-routing";
	import api from './api/'
	let apps = []
	api.get(`/listApps`).then(response => {
		// console.log(`response`, response)
		apps = response.data.result
	}).catch(error => {
		console.log(`error`, error)
	})
	const updateApps = async () => {
		try {
			let response = await api.get('/listApps')
			// console.log(`response on update`, response)
			apps = response.data.apps
		} catch (err) {
			console.log(`erro`, err)
		}
	}
	const updateRouter = async (app) => {
		navigate(`ips/${app}`)
  }
  const newApp = () => {
    navigate(`newApp`)
  }
</script>

<div class="row">
  {#each apps as app, i}
    <div class="card col-5 mx-2 my-2 bg-grey">
      <div class="card-body">
        <h5 class="card-title" color="black">
          <button class="btn btn-link" aria-current="page" on:click={updateRouter(app)}>
            <span data-feather="home">{app}</span>
          </button>
        </h5>
        <p class="card-text"></p>
      </div>
    </div>
  {/each}
</div>
<div class="row mt-5">
  <button type="button" on:click={newApp} class="btn btn-info">Criar nova aplicação</button>
</div>