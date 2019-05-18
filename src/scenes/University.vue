<template>
  <a-scene shadow="type: pcfsoft">
    <div class="ui-panel">
      <users/>
    </div>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <a-camera fov="60">
    </a-camera>
    <a-entity light="type: directional; color: #FFF; intensity: 1.4; castShadow:true;" position="-1 1 1"></a-entity>
    <a-box @mousedown="changeColor" shadow="receive: true" height="2" width="2" depth="2" position="0 1 -5" rotation="0 0 0" :color="color"></a-box>
    <a-box @mousedown="changeColor" shadow="receive: true" height="2" width="2" depth="2" position="3 1 -5" rotation="0 45 0" :color="color"></a-box>
    <a-plane shadow="receive: true" color="#59CD90" height="100" width="100" rotation="-90 0 0"></a-plane>
    <a-entity @trackpaddown="changeColor" laser-controls="hand: right"></a-entity>
  </a-scene>
</template>

<script>
import Users from '../components/Users.vue'

export default {
  name: 'University',
  data: () => ({
    color: '#121212'
  }),
  components: {
    Users
  },
  methods: {
    getRandomColor: function () {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    changeColor: function () {
      this.color = this.getRandomColor()
    }
  }
}
</script>

<style lang="scss">
.ui-panel {
  position: absolute;
  z-index: 10000;
  background-color: #00000080;
  top: 50vh;
  margin: 5px;
  width: 200px;
  height: 200px;
  transform: translateY(-50%)
}
</style>
