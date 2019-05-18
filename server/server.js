const express = require('express')
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const crypto = require('crypto')
const io = require('socket.io')(http)
const session = require('express-session')
const RedisStore = require('connect-redis')(session);
const cookie = require('cookie')
const cookieParser = require('cookie-parser')

const options = {
  host: 'localhost',
  port: 6379
}
const sessionStore = new RedisStore(options)

io.on('connection', function(socket){
  let handshake = socket.handshake
  console.log(handshake)
  let cookieSession = cookie.parse(handshake.headers.cookie)['openunivr']
  sessionStore.get(cookieParser.signedCookie(cookieSession, '1937eae48d32ef32'), function (err, session) {
    if (err) console.error(err)
    // Store socket id in database
    set_socket_id(session.current_user.email, socket.id)
    socket.on('call', async function (data) {
      // On call retrieve socket id for email in database, then send call notification
      let socketId = await get_socket_id(data.email)
      socket.on('offer', (data) => {
          console.log(data)
          console.log('current socket', socket.id)
          console.log('sending to', socketId[0].connection_id)
          socket.to(socketId[0].connection_id).emit('incoming_call', {user : {...session.current_user, socketID: socket.id}, offer: data})
      })
    })
    socket.on('answer', (data) => {
      console.log('answer recieved', data)
      socket.to(data.to).emit('answer', data.data)
    })
    socket.on('disconnect', () => {
      set_socket_id(session.current_user.email, null)
    })
  })
})

app.use(cors())
app.use(session({
  secret: '1937eae48d32ef32',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  name: 'openunivr'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/users', get_users)

app.use('/api', router)
app.use(express.static('../dist'))

async function login (req, res) {
  const data = req.body
  const response = await fetch_by_email_password(data.email, data.password)
  if (response.length == 0) {
    res.sendStatus(401)
  } else {
    if (!req.session.current_user) {
      req.session.current_user = response[0]
    }
    res.status(200).json(response[0])
  }
}

async function register (req, res) {
  const new_user = req.body
  const {password, salt} = await digest_password(new_user.password)
  const inserted = await register_user({
    ...new_user,
    password,
    salt
  })
  if (inserted) {
    res.sendStatus(200)
  }
}

async function get_users (req, res) {
  const users = await fetch_users()
  res.status(200).json(users)
}

http.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'openunivr'
})

connection.connect()

function set_socket_id(email, id) {
  connection.query(
    'UPDATE account SET connection_id = ? WHERE email = ? ',
    [id, email],
    function (error) {
      if (error) console.error(error)
    }
  )
}

function get_socket_id(email) {
  return new Promise( ( resolve, reject ) => {
    connection.query(
      'SELECT connection_id FROM account WHERE email = ? ',
      email,
      function (error, results) {
        if (error) reject(error)
        resolve(results)
      }
    )
  }) 
}

function fetch_users() {
  return new Promise( ( resolve, reject ) => {
    connection.query(
      'SELECT email, lastname, firstname FROM account',
      function (error, results) {
        if (error) reject(error)
        resolve(results)
      }
    )
  })
}

function fetch_by_email_password(email, password) {
  return new Promise( async ( resolve, reject ) => {
    password = await digest_password(password, email)
    connection.query(
      'SELECT email, lastname, firstname FROM account WHERE email = ? AND password = ?',
      [email, password],
      function (error, results) {
        if (error) reject(error)
        resolve(results)
      }
    )
  })
}

function get_salt_for_email(email) {
  return new Promise( ( resolve, reject ) => {
    connection.query(
      'SELECT salt FROM account WHERE email = ?',
      [email],
      function (error, results) {
        if (error) reject(error)
        resolve(results[0]['salt'])
      }
    )
  })
}

function register_user(user) {
  return new Promise( ( resolve, reject ) => {
    connection.query(
      'INSERT into account SET ?',
      user,
      function (error, results) {
        if (error) reject(error)
        resolve(results)
      }
    )
  })
}

function digest_password(password, email) {
  return new Promise( async ( resolve, reject ) => {
    let salt = ''
    if (email) {
      salt = await get_salt_for_email(email)
    } else {
      salt = await generate_random_bytes(8)
    }
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) throw reject(err)
      if (email) {
        resolve(derivedKey.toString('hex'))
      } else {
        resolve({password: derivedKey.toString('hex'), salt})
      }
    })
  })
}

function generate_random_bytes(nb) {
  return new Promise( ( resolve, reject ) => {
    crypto.randomBytes(nb, (err, buf) => {
      if (err) throw reject(err)
      resolve(buf.toString('hex'))
    })
  })
}

// connection.end()

// Gérer les connexions

// Système de sockets pour emission / reception des offres webrtc

// Système de rooms à faire avec les sockets (channels)

// Système de friends

/*

 -> Envoyer l'offre d'emission
 -> Reçoit un appel entrant

*/