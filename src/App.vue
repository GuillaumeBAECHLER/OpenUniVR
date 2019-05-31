<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <call-manager v-if="['app', 'home'].indexOf($route.name) > -1"/>
  </div>
</template>

<script lang="">
// TODO : Transcript into fair TS or remove TS use (used ts for promise support without aving to add babel config)
import CallManager from './components/CallManager'

export default {
  name: 'App',
  data: () => ({
    title: 'My app'
  }),
  components: {
    CallManager
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
