<script>
    import List, {Group, Item, Graphic, Meta, Label, Separator, Subheader, Text, PrimaryText, SecondaryText} from '@smui/list';
    import Button from '@smui/button';
    import api from '../api'
    export let files;
    export let nameApp;
</script>
<div class="col-md-8">
  <List>
    {#each files as file, i}
      <Item>
        <Label>data_{nameApp}_conjunto_{i}.json</Label>
      </Item>
    {/each}
  </List>
</div>