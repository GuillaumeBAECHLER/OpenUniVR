<template>
  <a-scene>
    <a-assets>
      <img id="sky" src="../assets/images/sky.jpg">
    </a-assets>
    <a-sky src="#sky"></a-sky>
    <a-camera fov="60">
      <a-cursor></a-cursor>
    </a-camera>
    <a-box height="2" width="2" depth="2" position="0 2 -5" rotation="0 45 0" color="#EE6352"></a-box>
    <a-plane color="#59CD90" height="100" width="100" rotation="-90 0 0"></a-plane>
  </a-scene>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>

</style>
