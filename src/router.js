import Vue from 'vue'
import Router from 'vue-router'
import DealerForm from './components/DealerForm.vue'
import authentication from './authentication'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'DealerForm',
            component: DealerForm,
            meta: {
                requiresAuthentication: true
              }
        },
        { path: '*', redirect: '/' },
    ]
})

// Global route guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuthentication)) {
      // this route requires auth, check if logged in
      if (authentication.isAuthenticated()) {
        // only proceed if authenticated.
        next();
      } else {
        authentication.signIn();
      }
    } else {
    console.log('no record meta match?')
      next();
    }
  });

export default router