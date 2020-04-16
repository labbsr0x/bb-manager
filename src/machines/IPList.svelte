<script>
    import { createEventDispatcher } from 'svelte';
    import List, {Group, Item, Graphic, Meta, Label, Separator, Subheader, Text, PrimaryText, SecondaryText} from '@smui/list';
    import Button from '@smui/button';
    import api from '../api'
    export let ips;

    const dispatch = createEventDispatcher();

    async function deleteIp(ip) {
      try {
        dispatch('handleDelete', {
          ip: ip
        });
      } catch (err) {
        console.log(`erro`, err)
      }
    }
</script>
<div>
  {#if ips.length}
    Máquinas
    <List>
      {#each ips as ip, i}
        <Item>
          <Label>{ip}</Label>
          <Meta>
            <Button color="secondary" on:click={deleteIp(ip)}>
              <Graphic class="material-icons">delete</Graphic>
            </Button>
          </Meta>
        </Item>
      {/each}
    </List>
  {:else}
    Nenhuma máquina cadastrada
  {/if}
</div>