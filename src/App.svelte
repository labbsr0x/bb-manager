<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Services from './Services.svelte'
  import CreateService from './CreateService.svelte'
  import Ips from './Ips.svelte'

  export let url = "";
</script>

<style>
/*
 * Globals
 */


/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
}


/*
 * Base structure
 */

body {
  text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, .5);
}

.cover-container {
  max-width: 60em;
}


/*
 * Header
 */

.nav-masthead .nav-link {
  padding: .25rem 0;
  font-weight: 700;
  color: rgba(255, 255, 255, .5);
  background-color: transparent;
  border-bottom: .25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
  border-bottom-color: rgba(255, 255, 255, .25);
}

.nav-masthead .nav-link + .nav-link {
  margin-left: 1rem;
}

.nav-masthead .active {
  color: #fff;
  border-bottom-color: #fff;
}
</style>


<body class="d-flex h-100 text-center text-white bg-dark">
  <Router url="{url}">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header class="mb-auto">
        <div>
          <h3 class="float-md-left mb-0">{process.env.TITLE}</h3>
          <nav class="nav nav-masthead justify-content-center float-md-right">
            <Link class="nav-link" to="/">Home</Link>
            <Link class="nav-link" to="apps">Aplicativos</Link>
          </nav>
        </div>
      </header>

      <main class="px-3">
        <Route path="apps" component="{Services}" />
        <Route path="ips/:nameApp" component="{Ips}" />
        <Route path="newApp" component="{CreateService}" />
        <Route path="/"><Home /></Route>
      </main>

      <footer class="mt-auto text-white-50">
        <a href="https://github.com/labbsr0x/big-brother" class="stretched-link">Parte do projeto Big Brother</a>
      </footer>
    </div>
  </Router>
</body>