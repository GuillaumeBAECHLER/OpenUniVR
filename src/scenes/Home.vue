<template>
  <a-scene>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
      <img id="call_image" src="../assets/images/call.png">
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
    <a-box
      v-for="(user, index) in users"
      :key="`user-${index}`"
      :position="`${user.position.x} ${user.position.y} ${user.position.z}`"
      color="red"></a-box>
  </a-scene>
</template>

<script>
import User from '../components/User.vue'
export default {
  name: 'home',
  data: () => ({
    users: []
  }),
  components: {
    User
  },
  mounted () {
    const vm = this
    this.$refs.ground.setAttribute('move-on-click', {movingObject: this.$refs.user.$el, marker: this.$refs.user_position})
    this.$socket().emit('connect_to_room', 'home')
    this.$socket().on('user_connected', (connected_user) => {
      vm.users = [
        ...(vm.users.filter((user) => user.id != connected_user.id)),
        connected_user
      ]
    })
    this.$socket().on('user_moved', (moved_user) => {
      vm.users = [
        ...(vm.users.filter((user) => user.id != moved_user.id)),
        moved_user
      ]
    })
    this.$socket().on('users', (users) => {
      console.log(users)
      vm.users = users
    })
  },
  beforeDestroy () {
    this.$socket().emit('disconnect_from_room', 'home')
  }
}
</script>

<style>

</style>
