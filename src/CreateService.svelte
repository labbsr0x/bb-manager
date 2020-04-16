<script>
  import Card, {Content, PrimaryAction, Media, MediaContent, Actions, ActionButtons, ActionIcons} from '@smui/card';
  import Button, {Label} from '@smui/button';
  import Textfield, {Input, Textarea} from '@smui/textfield'
  import HelperText from '@smui/textfield/helper-text/index'
  import FloatingLabel from '@smui/floating-label';
  import NotchedOutline from '@smui/notched-outline';
  import { navigate } from "svelte-routing";
  import api from './api/'
  let appName = ''
  let appDesc = ''
  let open = false
  const createApp = async () => {
    try {
      await api.post('/add/app', {
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
  const cancel = async () => {
    navigate(`/`)
  }
</script>
<style>

</style>
<Card>
  <Content class="mdc-typography--body2" style="max-width: 60%;">
    <h2 class="mdc-typography--headline6" style="margin: 0;">Cadastro de Aplicativos</h2>
    <div class="row">
      <Textfield class="col-12" bind:value={appName} label="Nome do aplicativo" />
      <Textfield class="col-12" textarea>
        <Textarea bind:value={appDesc} id="input-manual-d" aria-controls="helper-text-manual-d" aria-describedby="helper-text-manual-d" />
        <NotchedOutline>
          <FloatingLabel for="input-manual-d">Descrição do aplicativo</FloatingLabel>
        </NotchedOutline>
      </Textfield>
    </div>
  </Content>
  <Actions>
    <ActionButtons>
      <Button color="secondary" on:click={cancel}>
        <Label>Cancelar</Label>
      </Button>
      <Button color="secondary" on:click={createApp}>
        <Label>Salvar</Label>
      </Button>
    </ActionButtons>
  </Actions>
</Card>