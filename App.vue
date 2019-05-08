<template>
  <div v-if="connectedUser">
    <p>Welcome {{connectedUser.firstname}} {{connectedUser.lastname}}</p>
  </div>
  <div v-else>
    <p>Please Login</p>
    <form @submit="login">
      <label for="login">Login :</label>
      <input id="login" type="text" v-model="username" autocomplete="username"/>
      <label for="password">Mot de passe :</label>
      <input id="passord" type="password" v-model="password" autocomplete="current-password"/>
      <input type="submit"/>
    </form>
    <hr/>
    <p>No Account ? Create One !</p>
    <form @submit="register">
      <div>
        <label for="register-login">Mail :</label>
        <input id="register-login" type="text" v-model="username" autocomplete="email"/>
      </div>
      <div>
      <label for="register-password">Mot de passe :</label>
      <input id="register-passord" type="password" v-model="password" autocomplete="new-password"/>
      <div/>
      <div>
      <label for="register-firstname">Prénom :</label>
      <input id="register-firstname" type="text" autocomplete="given-name" v-model="firstname"/>
      <div/>
      <div>
      <label for="register-lastname">Nom :</label>
      <input id="register-lastname" type="text" autocomplete="family-name" v-model="lastname"/>
      <div/>
      <div>
      <input type="submit"/>
      <div/>
    </form>
  </div>
</template>

<script lang="ts">
// TODO : Transcript into fair TS (used ts for async / await support without aving to add babel config)

export default {
  name: 'App',
  data: () => ({
    // TODO : use Vuex for storing user ...
    connectedUser: null,
    username: '',
    password: '',
    firstname: '',
    lastname: ''
  }),
  methods: {
    async login (event: Event) {
      event.preventDefault()
      let payload = {
        email: this.username,
        password: this.password
      }
      try {
        const response = await this.$http.post('/login', payload)
        console.log(response.data)
        this.connectedUser = response.data
      } catch (err) {
        console.error(err)
      }
    },
    async register (event: Event) {
      event.preventDefault()

    }
  }
}
</script>

<style>

</style>
