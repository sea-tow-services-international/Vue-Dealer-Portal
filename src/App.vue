<template>
  <div>
    <NavBar></NavBar>
    <router-view />
  </div>
</template>

<script>
import authentication from './authentication'
import NavBar from './components/NavBar.vue'
export default {
  name: 'app',
  computed: {
    isAuthenticated() {
      return authentication.isAuthenticated()
    },
  },
  components: {
    'NavBar': NavBar
  },
  methods: {
    logOut() {
      authentication.signOut()
    },
  },
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
