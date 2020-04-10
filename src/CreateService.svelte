<script>
  import { navigate } from "svelte-routing";
  import api from './api/'
  let appName = ''
  let appDesc = ''
  let open = false
  const createApp = async () => {
    try {
      await api.post('/addApp', {
          name: appName,
          desc: appDesc,
          address: ''
      })
      navigate(`apps`)
    } catch (err) {
      open = true
      console.log(`erro`, err)
    }
  }
</script>
<style>
.card-app-text {
  color: black;
}
</style>

<div class="row">
  <div class="card col-11 mx-2 my-2 bg-grey">
    <div class="card-body">
      <h5 class="card-title card-app-text">Adicionar nova aplicação</h5>
      <div class="row">
        <div class="col-6 offset-3">
          <div class="form-group">
            <input class="form-control" placeholder="Nome da aplicação" id="appName" aria-describedby="appNameHelp" bind:value={appName} />
            <textarea rows="3" class="form-control" placeholder="Descrição da aplicação" id="appDesc" aria-describedby="appNameHelp" bind:value={appDesc} ></textarea>
          </div>
          <button type="button" on:click={createApp} class="btn btn-info">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</div>
<Modal title="Erro ao criar app" open="{open}" />