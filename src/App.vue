<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">DealerForm</router-link> | 
    </div>
    <router-view/>
  </div>
</template>

<script>
import authentication from './authentication'
export default {
  name: 'app',
  computed: {
    isAuthenticated() {
      return authentication.isAuthenticated();
    }
  },
  methods: {
    logOut() {
      authentication.signOut();
    }
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
