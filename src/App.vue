<template>
  <div id="app">
    <SearchTop />
    <DealerForm />
  </div>
</template>

<script>
import DealerForm from './components/DealerForm.vue'
import SearchTop from './components/SearchTop.vue'

export default {
  name: 'App',
  components: {
    SearchTop,
    DealerForm
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
