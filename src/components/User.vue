<template>
    <a-entity>
      <a-camera fov="60">
        <a-cursor v-if="!(AFRAME.utils.device.isOculusGo())"></a-cursor>
      </a-camera>
      <a-entity laser-controls="hand: right">
      </a-entity>
      <a-ring color="teal" rotation="-90 0 0" position="0 0.1 0" radius-inner="0.2" radius-outer="0.3">
        <a-box width="0.1" height="0.1" depth="0.05" position="0 0.25 0.1" @click="showDialog"></a-box>
        <a-entity geometry="primitive: plane" material="color: #a5a5af" ref="dialog" width="1" height="1" rotation="55 0 0" position="0 1 1" v-if="dialog">
          <users></users>
        </a-entity>
      </a-ring>
    </a-entity>
</template>

<script>
import Users from './Users.vue'
import AFRAME from 'aframe'

export default {
  name: 'user',
  data: () => ({
    dialog: false,
    AFRAME
  }),
  components: {
    Users
  },
  methods: {
    showDialog () {
      this.dialog = !this.dialog
    }
  }
}
</script>

<style>

</style>
