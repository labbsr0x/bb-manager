<script>
    import IconButton, {Icon} from '@smui/icon-button';
    import { navigate } from "svelte-routing";

    export let title = ''
    export let url = '/apps'

    const backPage = () => {
      navigate(url)
    }
</script>
<div>
  <IconButton class="material-icons" on:click={backPage} ripple={false}>arrow_back</IconButton> 
  <h1 class="h2" style="display: inline;">
    {title}
  </h1>
</div>