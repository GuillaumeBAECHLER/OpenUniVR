<template>
  <a-scene>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
      <img id="call_image" src="../assets/images/call.png">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <a-plane ref="ground" color="#827974" height="25" width="25" rotation="-90 0 0"></a-plane>
    <a-circle
      ref="user_position"
      position="0 0.001 0"
      rotation="-90 0 0"
      visible="false"
      animation="startEvents: moveuser; pauseEvents: moveusercancelled; property: scale; to: 0 0 0; dur: 1000; easing: linear"
    ></a-circle>
    <a-entity :gltf-model="university_home"></a-entity>
    <user ref="user"></user>
    <a-entity
      v-for="(user, index) in state.connectedUsers"
      :key="`user-${index}`"
      :gltf-model="character"
      :position="`${user.position.x} ${user.position.y} ${user.position.z}`"
      set-color
    >
      <a-entity
        geometry="primitive: plane; width: 1; height: auto"
        material="side: double; shader: flat; blending: additive; color: #000"
        rotation="0 -90 0"
        position="0 2.5 0"
        :text="{
            value: `${user.firstname} ${user.lastname}`,
            color: '#fff',
            side: 'double',
            align: 'center',
            width: 2
          }"
        >
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
import User from '../components/User.vue'
import { EventBus } from '../event-bus'
import store from '../store'

const assets = {
  university_home: require('../assets/home.glb'),
  character: require('../assets/character.glb')
}

export default {
  name: 'home',
  data: () => ({
    state: store.state,
    ...assets
  }),
  components: {
    User
  },
  mounted () {
    const vm = this
    this.$refs.ground.setAttribute('move-on-click', {movingObject: this.$refs.user.$el, marker: this.$refs.user_position})
    this.$socket().emit('connect_to_room', 'home')
    this.$socket().on('user_connected', (connected_user) => {
      store.setConnectedUsers([
        ...(vm.state.connectedUsers.filter((user) => user.id != connected_user.id)),
        connected_user
      ])
    })
    this.$socket().on('user_moved', (moved_user) => {

      store.setConnectedUsers([
        ...(vm.state.connectedUsers.filter((user) => user.id != moved_user.id)),
        moved_user
      ])
    })
    this.$socket().on('users', (users) => {
      console.log(users)
      // recieving users
      store.setConnectedUsers(users)
      for (let user of users) {
        if (store.state.connectedUser.email != user.email)
        EventBus.$emit('call', user)
      }
      // 
    })
  },
  beforeDestroy () {
    this.$socket().emit('disconnect_from_room', 'home')
  }
}
</script>

<style>

</style>
