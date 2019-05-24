<template>
    <a-entity>
      <a-camera fov="60">
        <a-cursor></a-cursor>
      </a-camera>
      <a-entity laser-controls="hand: right">
      </a-entity>
      <a-plane 
        shader="flat"
        width="0.2"
        height="0.2"
        rotation="-90 0 0"
        position="0.1 0 0"
      >
        <a-ring color="teal" position="0 0 1" radius-inner="0.2" radius-outer="0.3"></a-ring>
      </a-plane>
    </a-entity>
</template>

<script>
export default {
  name: 'user'
}
</script>

<style>

</style>
