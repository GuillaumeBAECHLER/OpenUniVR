<template>
  <div>
    <my-audio
      v-for="(stream, key) in state.userStreams"
      :key="key"
      :user="state.connectedUsers.find((user) => user.id === key)"
    />
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
    state: store.state
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
    EventBus.$on('call', user => {
      vm.call(user)
    });
  },
  methods: {
    async call(user) {
      this.$socket().emit('call', { email: user.email })
      const p = await this.startPeer(true, user.id)
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
        store.setStream(distantSocketID, stream)
        console.log('STREAM ADDED')
      })
    }
  }
}
</script>

<style>

</style>