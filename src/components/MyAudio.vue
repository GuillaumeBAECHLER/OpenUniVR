<template>
  <audio autoplay ref="audio"></audio>
</template>

<script>
import store from '../store'
import { EventBus } from '../event-bus'

export default {
  name: 'MyAudio',
  data: () => ({
    me: store.state.connectedUser
  }),
  props: ['user'],
  mounted() {
    let vm = this
    console.log('mounted', this.user, store.state.userStreams[this.user.id])
    let audioPlayer = this.$refs.audio
    if ("srcObject" in audioPlayer) {
      audioPlayer.srcObject = store.state.userStreams[this.user.id]
    } else {
      // Avoid using this in new browsers, as it is going away.
      audioPlayer.src = window.URL.createObjectURL(store.state.userStreams[this.user.id])
    }
    EventBus.$on('move', () => {
      console.log('ME')
      vm.adjustVolume()
    });
  },
  methods: {
    adjustVolume: function () {
      console.log('VOLUME ADJUSTING', this.$refs.audio)
      let aPos = {x: 0, y: 0, z: 0}
      let bPos = {...aPos}
      if (store.state.connectedUser.position) {
        aPos = store.state.connectedUser.position
      }
      if (this.user.position) {
        bPos = this.user.position
      }
      const distance = Math.sqrt((bPos.x - aPos.x)**2 + (bPos.z - aPos.z)**2)
      let volume = (1 - (distance/10)).toFixed(2)
      console.log(volume)
      if (volume < 0) {
        volume = 0  
      } else if (volume > 1) {
        volume = 1
      }
      let audioPlayer = this.$refs.audio
      audioPlayer.volume = volume
    }
  },
  watch: {
    user: function (val) {
      console.log('USER')
      this.adjustVolume()
    }
  }
}
</script>

<style>

</style>
