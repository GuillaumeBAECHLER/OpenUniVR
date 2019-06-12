<template>
  <audio autoplay ref="audio"></audio>
</template>

<script>
export default {
  name: 'MyAudio',
  props: ['stream'],
  mounted() {
    var audioPlayer = this.$refs.audio
    if ("srcObject" in audioPlayer) {
      audioPlayer.srcObject = this.stream
    } else {
      // Avoid using this in new browsers, as it is going away.
      audioPlayer.src = window.URL.createObjectURL(this.stream)
    }
  }
}
</script>

<style>

</style>
