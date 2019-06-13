var store = {
  state: {
    connectedUser: null,
    userStream: null
  },
  loggedIn () {
    return (this.state.connectedUser)?true:false
  },
  setLogin (user) {
    this.state.connectedUser = user
  }
}
export default store