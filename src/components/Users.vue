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
      <audio controls autoplay ref="audio"></audio>
    </a-entity>
</template>

<script lang="ts">
import Peer from 'simple-peer'

export default {
  name: 'Users',
  data: () => ({
    users: []
  }),
  async created () {
    console.log('CREATED')
    this.users = (await this.$http.get('/users')).data
    console.log('GOT USERS')
    this.$socket().on('incoming_call', async (data) => {
      const user = data.user
      console.log(`${user.firstname} ${user.lastname} - ${user.socketID} - essaye de vous joindre !`, data.offer)
      const p = await this.startPeer(false, user.socketID)
      p.signal(data.offer)
    })
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