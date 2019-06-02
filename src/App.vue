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
import store from './store'

export default {
  name: 'App',
  data: () => ({
    title: 'My app'
  }),
  components: {
    CallManager
  },
  mounted () {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(this.handleSuccess);
  },
  methods: {
    handleSuccess (stream) {
      // Process stream so that it stays up
      var context = new AudioContext()
      var source = context.createMediaStreamSource(stream)
      store.state.userStream = stream
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
