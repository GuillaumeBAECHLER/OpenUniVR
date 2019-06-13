<template>
  <div>
    <my-audio v-for="connectedUser in connectedUsers" :key="connectedUser.id" :stream="connectedUser.stream"/>
  </div>
</template>

<script lang="ts">
import Peer from 'simple-peer'
import { EventBus } from '../event-bus'
import store from '../store'
import MyAudio from './MyAudio.vue'

export default {
  name: 'CallManager',
  data: () => ({
    connectedUsers: []
  }),
  components: {
    MyAudio
  },
  async created () {
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
      let p = new Peer({
        initiator,
        stream: store.state.userStream,
        trickle: false
      })
      this.bindEvents(p, distantSocketID)
      return p
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
        vm.connectedUsers.push({
          id: distantSocketID,
          stream
        })
      })
    }
  }
}
</script>

<style>

</style>