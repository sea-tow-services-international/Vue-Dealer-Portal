<template>
  <b-container>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="secondary">
        <b-navbar-brand href="#">Sea Tow Membership App</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template #button-content>
                <em>{{ getName }}</em>
              </template>
              <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse> 
      </b-navbar>
    </div>
  </b-container>
</template>

<script>
import authentication from "./../authentication";

export default {
  computed: {
    getName() {
      if (authentication.isAuthenticated()) {
        var profile = authentication.getUserProfile();
        return profile.name;
      } else {
        return "Invalid Session..";
      }
    },
  },
  methods: {
    logOut() {
      authentication.signOut()
    },
  }
};
</script>
