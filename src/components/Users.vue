<template>
  <div>
  <p>Registered Users (click to call): </p>
  <ul>
    <li v-for="(user, index) in users" :key="`user-${index}`" @click="call(user.email)">{{user.firstname}} {{user.lastname}}</li>
  </ul>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client'

export default {
  name: 'Users',
  data: () => ({
    users: [],
    socket: null
  }),
  async created () {
    this.users = (await this.$http.get('/users')).data
    this.socket = io('http://localhost:3000');
    this.socket.on('message', (user) => {
      console.log(`${user.firstname} ${user.lastname} essaye de vous joindre !`)
    })
    console.log('socket connected')
  },
  methods: {
    call(email) {
      this.socket.emit('call', { email })
    }
  }
}
</script>

<style>

</style>
