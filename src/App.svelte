<!-- App.svelte -->
<svelte:head>
  <title>Bb-Manager {process.env.TITLE}</title>
</svelte:head>

<section>
    <div class="drawer-container">
      <Drawer variant="dismissible" bind:this={myDrawer} bind:open={myDrawerOpen}>
        <Header>
          Menu
        </Header>
        <Content>
          <List>
            {#each menus as menu, i}
              <Item href="javascript:void(0)" on:click={() => setActive(menu)} activated={active === menu.value}>
                <Graphic class="material-icons" aria-hidden="true">{menu.icon}</Graphic>
                <Text>{menu.text}</Text>
              </Item>
            {/each}
          </List>
        </Content>
      </Drawer>

      <AppContent class="app-content">
        <main class="main-content">
          <TopAppBar variant="static" color='primary'>
            <Row>
              <Section>
                <IconButton on:click={() => myDrawerOpen = !myDrawerOpen} class="material-icons">menu</IconButton>
                <Title>{process.env.TITLE}</Title>
              </Section>
              <Section align="end" toolbar>
                <IconButton class="material-icons" aria-label="Download">file_download</IconButton>
                <IconButton class="material-icons" aria-label="Print this page">print</IconButton>
                <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton>
              </Section>
            </Row>
          </TopAppBar>
          <div>
            <Router url="{url}">
              <Route path="apps" component="{Services}" />
              <Route path="ips/:nameApp" component="{Ips}" />
              <Route path="newApp" component="{CreateService}" />
              <Route path="/"><Home /></Route>
            </Router>
          </div>
        </main>
      </AppContent>
    </div>
  

  
</section>

<script>
  import { Router, Link, Route, link, navigate } from "svelte-routing";
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import Drawer, {AppContent, Content, Header, Scrim} from '@smui/drawer';
  import Button, {Label} from '@smui/button';
  import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
  import H6 from '@smui/common/H6.svelte';
  import Home from "./Home.svelte";
  import Services from './Services.svelte'
  import CreateService from './CreateService.svelte'
  import Ips from './Ips.svelte'
  export let url = "";
  let clicked = 'nothing yet';
  let myDrawer;
  let myDrawerOpen = false;
  let active = 'Gray Kittens';
  let myDrawer2;
  let myDrawer2Open = false;
  let active2 = 'Inbox';
  let menus = [
    {
      icon: 'home',
      value: 'home',
      text: 'Home',
      link: '/',
      component: Home
    },
    {
      icon: 'apps',
      value: 'apps',
      text: 'Aplications',
      link: '/apps',
      component: Services
    }
  ]
  let selected = Home
  function setActive(menu) {
    console.log('menu', menu)
    navigate(menu.link, { replace: true });
    active = menu.value;
    myDrawerOpen = false;
  }
</script>

<style>
  .drawer-container {
    position: relative;
    display: flex;
    height: 350px;
    max-width: 100%;
    overflow: hidden;
    z-index: 0;
  }
  * :global(.mdc-drawer--modal, .mdc-drawer-scrim) {
    /* This is not needed for a page-wide modal. */
    position: absolute;
  }
  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }
  .main-content {
    overflow: auto;
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
  }
</style>