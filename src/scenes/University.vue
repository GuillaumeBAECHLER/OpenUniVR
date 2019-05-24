<template>
  <a-scene>
    <!-- <div class="ui-panel">
      <users/>
    </div>-->
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <a-entity :gltf-model="university_wall" rotation="0 180 0">
      <a-entity :gltf-model="university_doors" show-clickable-on-hover @click="$router.push({ name: 'home' })"></a-entity>
    </a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 1.4; castShadow:true;" position="-1 1 1"></a-entity>
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
import Users from '../components/Users.vue'
import User from '../components/User.vue'
const assets = {
  university_wall: require('../assets/university.glb'),
  university_doors: require('../assets/university-doors.glb'),
}

export default {
  name: 'University',
  data: () => ({
    color: '#121212',
    ...assets
  }),
  mounted () {
    this.$refs.ground.setAttribute('move-on-click', {movingObject: this.$refs.user.$el, marker: this.$refs.user_position})
  },
  components: {
    Users,
    User
  }
}
</script>

<style lang="scss">
</style>
