<script>
	import api from './api'
	import Ips from './Ips.svelte'
	let apps = []
	let nameApp = ''
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
	const updateNameApp = async (app) => {
		// console.log(`name app on app`, app)
		nameApp = app
	}
</script>

<nav class="navbar navbar-expand navbar-dark bg-dark">
  <a class="navbar-brand" href="" on:click={updateApps} >{process.env.TITLE}</a>
</nav>
<div class="container-fluid">
  <div class="row">
    <nav id="sidebarMenu" class="col-md-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
		  <li class="nav-item">
            <span data-feather="home">Lista de aplicativos</span>
          </li>
		  {#each apps as app, i}
          <li class="nav-item">
            <button class="btn btn-link" aria-current="page" on:click={updateNameApp(app)}>
              <span data-feather="home">{app}</span>
              
            </button>
          </li>
		  {/each}
		  <li class="nav-item">
            <button class="btn btn-link" style="font-size: 12px;" aria-current="page" on:click={updateNameApp(app)}>
              <span data-feather="home">Criar app</span>
              
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
      {#if nameApp}
		<Ips nameApp={nameApp}></Ips>
	  {/if}
    </main>
  </div>
</div>