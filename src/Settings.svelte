<script>
import Kitchen from '@smui/snackbar/kitchen/index';
import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
import Button, {Label} from '@smui/button';
import { navigate } from "svelte-routing";
import api from './api/'
let data = []
let kitchen
const apiURL = '/settings'
api.get(apiURL).then(response => {
	// console.log(`response`, response)
	data = response.data.result
}).catch(error => {
	console.debug(`error`, error)
	kitchen.push({
		props: {
			variant: 'stacked'
		},
		label: 'Ocorreu um erro na listagem dos aplicativos'
	})
})
const updateData = async () => {
	try {
		let response = await api.get(apiURL)
		data = response.data.result
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
const newApp = () => {
	navigate(`new/settings`)
}
const deleteData = async (setting) => {
	try {
		await api.delete(`${apiURL}/${setting}`)
		kitchen.push({
			props: {
				variant: 'stacked'
			},
			label: 'Configuração excluida com sucesso.'
		})
		await updateData()
		// console.log(`response on update`, response)
	} catch (err) {
		kitchen.push({
			props: {
				variant: 'stacked'
			},
			label: 'Ocorreu um erro e não foi possível excluir a configuração'
		})
		console.log(`erro`, err)
	}
}
</script>

<div style="display: flex; flex-wrap: wrap;">
  {#each data as setting, i}
    <div class="card-container">
      <Card style="width: 360px;">
        <Content class="mdc-typography--body2">
          <h2 class="mdc-typography--headline6" style="margin: 0;">{setting._namespace}</h2>
        </Content>
        <Actions>
          <ActionButtons>
            <Button color="primary" on:click={deleteData(setting._namespace)}>
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
    <Label>Criar nova configuração</Label>
  </Button>
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
</style>