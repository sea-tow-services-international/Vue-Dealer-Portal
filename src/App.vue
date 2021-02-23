<template>
  <div id="app">
    <Search />
    <!-- <DealerForm /> -->
  </div>
</template>

<script>
//import DealerForm from './components/DealerForm.vue'
import Search from './components/Search.vue'

export default {
  name: 'App',
  components: {
    //DealerForm,
    Search
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
