<template>
  <div id="app">
    <DealerForm />
  </div>
</template>

<script>
import DealerForm from './components/DealerForm.vue'

export default {
  name: 'App',
  components: {
    DealerForm,
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
