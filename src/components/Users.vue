<template>
    <a-entity>
      <a-entity 
        v-for="(user, index) in users"
        :key="`user-${index}`"
        material="shader: flat; color: #f3f6f8"
        geometry="primitive: plane; height: 0.08;"
        :text="{
          value: `${user.firstname} ${user.lastname}`,
          color: '#999',
          position: '1 0 0'
        }"
        :position="`0 ${0.5 - (index * 0.1)} 0.001`">
          <a-image
            width="0.05"
            height="0.05"
            src="#call_image"
            position="0.4 0 0.01"
            animation__mouseenter="startEvents: mouseenter; property: scale; to: 1.2 1.2 1.2; dur: 100; easing: linear;"
            animation__mouseleave="startEvents: mouseleave; property: scale; to: 1 1 1; dur: 100; easing: linear;"
            @click="call(user.email)"
          />
        </a-entity>
    </a-entity>
</template>

<script lang="ts">
import { EventBus } from '../event-bus'
import Peer from 'simple-peer'

export default {
  name: 'Users',
  data: () => ({
    users: []
  }),
  async created () {
    console.log('CREATED USERS')
    this.users = (await this.$http.get('/users')).data
    console.log('GOT USERS')
  },
  methods: {
    async call(email) {
      EventBus.$emit('call', email)
    },
  }
}
</script>

<style>

</style>