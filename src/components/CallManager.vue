<template>
  <audio autoplay ref="audio"></audio>
</template>

<script lang="ts">
import Peer from 'simple-peer'
import { EventBus } from '../event-bus'

export default {
  name: 'CallManager',
  data: () => ({
    connectedUsers: []
  }),
  async created () {
    console.log('CREATED AUDIO')
    const vm = this
    this.$socket().on('incoming_call', async (data) => {
      const user = data.user
      console.log(`${user.firstname} ${user.lastname} - ${user.socketID} - essaye de vous joindre !`, data.offer)
      const p = await this.startPeer(false, user.socketID)
      p.signal(data.offer)
    })
    EventBus.$on('call', userMail => {
      vm.call(userMail)
    });
  },
  methods: {
    async call(email) {
      this.$socket().emit('call', { email })
      const p = await this.startPeer(true)
      this.$socket().on('answer', (data) => {
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
          vm.$socket().emit('offer', data)
        } else if (data.type === 'answer') {
          vm.$socket().emit('answer', {to: distantSocketID, data} )
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