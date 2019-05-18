<template>
  <div>
    <p>Registered Users: </p>
    <ul>
      <li v-for="(user, index) in users" :key="`user-${index}`" @click="call(user.email)">{{user.firstname}} {{user.lastname}}</li>
    </ul>
    <audio controls autoplay width="100px" height="100px" ref="audio"></audio>
  </div>
</template>

<script lang="ts">
import io from 'socket.io-client'
import Peer from 'simple-peer'

export default {
  name: 'Users',
  data: () => ({
    users: [],
    socket: null
  }),
  async created () {
    this.users = (await this.$http.get('/users')).data
    this.socket = io('http://192.168.2.2:3000')
    this.socket.on('incoming_call', async (data) => {
      const user = data.user
      console.log(`${user.firstname} ${user.lastname} - ${user.socketID} - essaye de vous joindre !`, data.offer)
      const p = await this.startPeer(false, user.socketID)
      p.signal(data.offer)
    })
  },
  methods: {
    async call(email) {
      this.socket.emit('call', { email })
      const p = await this.startPeer(true)
      this.socket.on('answer', (data) => {
        p.signal(data)
      })
    },
    startPeer(initiator, distantSocketID) {
      const vm = this
      return new Promise( ( resolve, reject ) => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(function(stream) {
            let p = new Peer({
              initiator,
              stream,
              trickle: false
            })
            vm.bindEvents(p, distantSocketID)
            resolve(p)
          })
          .catch(function(err) {
            reject(err.name + ": " + err.message)
          })
      })
    },
    bindEvents(p, distantSocketID) {
      let vm = this
      p.on('error', function(err) {
        console.error(err)
      })
      p.on('signal', function(data) {
        if (data.type === 'offer') {
          vm.socket.emit('offer', data)
        } else if (data.type === 'answer') {
          vm.socket.emit('answer', {to: distantSocketID, data} )
        }
      })
      p.on('stream', function(stream) {
        var audioPlayer = vm.$refs.audio
        if ("srcObject" in audioPlayer) {
          audioPlayer.srcObject = stream
        } else {
          // Avoid using this in new browsers, as it is going away.
          audioPlayer.src = window.URL.createObjectURL(stream);
        }
      })
    }
  }
}
</script>

<style>

</style>