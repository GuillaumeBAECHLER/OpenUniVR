<template>
  <div>
  <p>Registered Users : </p>
  <ul>
    <li v-for="(user, index) in users" :key="`user-${index}`">{{user.firstname}} {{user.lastname}}</li>
  </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Users',
  data: () => ({
    users: []
  }),
  async created () {
    this.users = (await this.$http.get('/users')).data
  }
}
</script>

<style>

</style>
