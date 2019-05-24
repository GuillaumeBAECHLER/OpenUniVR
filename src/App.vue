<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="">
// TODO : Transcript into fair TS or remove TS use (used ts for promise support without aving to add babel config)

export default {
  name: 'App',
  data: () => ({
    title: 'My app'
  }),
  components: {
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
