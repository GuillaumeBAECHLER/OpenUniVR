<template>
  <a-scene>
    <div class="ui-panel">
      <p v-show="showloader">déplacement en cours...</p>
      <users/>
    </div>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <!-- <a-entity gltf-model="#university" rotation="0 180 0" material="color: white" modify-materials></a-entity>
    -->
    <a-entity :gltf-model="university_wall" rotation="0 180 0">
      <a-entity :gltf-model="university_doors" show-clickable-on-hover></a-entity>
    </a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 1.4; castShadow:true;" position="-1 1 1"></a-entity>
    <a-plane shadow="receive: true" color="#59CD90" height="25" width="25" rotation="-90 0 0" @mousedown="initiateMove" @mouseup="cancelMove"></a-plane>
    <a-circle 
      ref="user_position"
      position= "0 0.001 0"
      rotation="-90 0 0"
      animation="startEvents: moveuser; pauseEvents: moveusercancelled; property: scale; to: 0 0 0; dur: 1000; easing: linear"
    ></a-circle>
    <a-entity ref="user">
      <a-camera fov="60" ref="camera">
        <a-cursor></a-cursor>
      </a-camera>
      <a-entity @trackpaddown="changeColor" laser-controls="hand: right">
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
import Users from '../components/Users.vue'
const assets = {
  university_wall: require('../assets/university.glb'),
  university_doors: require('../assets/university-doors.glb'),
}

export default {
  name: 'University',
  data: () => ({
    color: '#121212',
    moving: null,
    showloader: false,
    ...assets
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
    },
    initiateMove: function(evt) {
      const vm = this
      const moveto = evt.detail.intersection.point
      vm.showloader = true
      vm.$refs.user_position.setAttribute(
        'position', 
        {
        ...moveto,
        y: vm.$refs.user_position.getAttribute('position').y
        }
      )
      vm.$refs.user_position.dispatchEvent(new Event('moveuser'));
      this.moving = setTimeout(function(){
        vm.showloader = false
        vm.$refs.user.setAttribute(
          'position', 
          {
          ...moveto,
          y: vm.$refs.user.getAttribute('position').y
          }
        )
      }, 1000)
    },
    cancelMove: function() {
      clearTimeout(this.moving)
      this.showloader = false
      this.$refs.user_position.dispatchEvent(new Event('moveusercancelled'))
      this.$refs.user_position.setAttribute(
        'scale', {
          x: 1, y: 1, z: 1
        }
      )
      this.$refs.user_position.setAttribute(
        'position', 
        {
        ...(this.$refs.user.getAttribute('position')),
        y: this.$refs.user_position.getAttribute('position').y
        }
      )
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
