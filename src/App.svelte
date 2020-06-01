<!-- App.svelte -->
<svelte:head>
  <title>Bb-Manager {process.env.TITLE}</title>
</svelte:head>

<section>
    <div class="drawer-container">
      <Drawer variant="dismissible" bind:this={myDrawer} bind:open={myDrawerOpen}>
        <Header style="padding: 0px">
          <Img style="width: 256px; heigth: inherit;" src="/default.png" />
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
                <Title>{'TITLE' in process.env ? process.env.TITLE : 'Big Brother Manager'}</Title>
              </Section>
            </Row>
          </TopAppBar>
          <div>
            <div class="row">
              <div class="col-md-6 offset-md-3">
                <Router url="{url}">
                  <Route path="apps" component="{Services}" />
                  <Route path="settings" component="{Settings}" />
                  <Route path="ips" component="{Ips}" />
                  <Route path="versions/:nameApp" component="{Versions}" />
                  <Route path="new/:form" component="{BasicForm}" />
                  <Route path="/"><Home /></Route>
                </Router>
              </div>
            </div>
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
	import Img from '@smui/common/Img.svelte'
	import Home from "./Home.svelte";
	import Services from './Services.svelte'
	import Settings from './Settings.svelte'
	import BasicForm from './forms/BasicForm.svelte'
	import Ips from './Ips.svelte'
	import Versions from './Versions.svelte'
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
		},
		{
			icon: 'settings',
			value: 'settings',
			text: 'Configurações',
			link: '/settings',
			component: Services
		}
	]
	let selected = Home
	function setActive(menu) {
		navigate(menu.link, { replace: true });
		active = menu.value;
		myDrawerOpen = false;
	}
</script>

<style>
  .drawer-container {
    position: relative;
    display: flex;
    height: 900px;
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
    height: 100%;
    box-sizing: border-box;
  }
</style>