<template>
  <a-scene>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <a-plane ref="ground" shadow="receive: true" color="#59CD90" height="25" width="25" rotation="-90 0 0"></a-plane>
    <a-circle
      ref="user_position"
      position="0 0.001 0"
      rotation="-90 0 0"
      visible="false"
      animation="startEvents: moveuser; pauseEvents: moveusercancelled; property: scale; to: 0 0 0; dur: 1000; easing: linear"
    ></a-circle>
    <user ref="user"></user>
  </a-scene>
</template>

<script>
import User from '../components/User.vue'
export default {
  name: 'home',
  components: {
    User
  },
  mounted () {
    console.log(this.$refs.user)
    this.$refs.ground.setAttribute('move-on-click', {movingObject: this.$refs.user.$el, marker: this.$refs.user_position})
  }
}
</script>

<style>

</style>
