var store = {
  state: {
    connectedUser: null,
    connectedUsers: [],
    userStream: null,
    userStreams: {}
  },
  loggedIn () {
    return (this.state.connectedUser)?true:false
  },
  setUser (user) {
    this.state.connectedUser = user
  },
  setConnectedUsers (users) {
    this.state.connectedUsers = [...users]
  },
  setStream (userId, stream) {
    this.state.userStreams = {
      ...this.state.userStreams,
      [userId]: stream
    }
  }
}
export default store