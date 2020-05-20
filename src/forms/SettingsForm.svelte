<script>
  import { onMount } from 'svelte';
  import Textfield from '@smui/textfield'
  export let data = {}
  let namespace = ''
  let template = ''
  let etcd = ''
  let remote = ''
  let image = ''

  $: {
    data.namespace = namespace
    data.template = template
    data.etcd = etcd
    data.remote = remote
    data.image = image
  }

  onMount(() => {
    console.log('data', data)
    if (!Object.keys(data)) {
      data = {
        namespace: '',
        template: '',
        etcd: '',
        remote: '',
        image: ''
      }
    }
    console.log('data after', data)
  })
</script>
<style>

</style>
<div class="row">
  <Textfield bind:value={namespace} label="Namespace" />
  <Textfield bind:value={template} label="Template" />
  <Textfield bind:value={etcd} label="Etcd url" />
  <Textfield bind:value={remote} label="Remote Write" />
</div>