const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const crypto = require('crypto')

app.use(bodyParser.json())
app.use(cors())

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
app.use('/api', router)

app.use(express.static('../dist'))

async function login (req, res) {
  const data = req.body
  const response = await fetch_by_email_password(data.email, data.password)
  if (response.length == 0) {
    res.sendStatus(401)
  } else {
    res.status(200).json(response[0])
  }
}

async function register (req, res) {
  const new_user = req.body
  const {password, salt} = await digest_password(new_user.password)
  console.log(password, salt)
  const response = await register_user({
    ...new_user,
    password,
    salt
  })
  console.log(response)
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'openunivr'
})

connection.connect()

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
    console.log(user)
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

connection.query('SELECT email, lastname, firstname FROM account', function (error, results, fields) {
  if (error) throw error
  console.log(JSON.stringify(results))
})

// connection.end()

// Gérer les connexions

// Système de sockets pour emission / reception des offres webrtc

// Système de rooms à faire avec les sockets (channels)

// Système de friends

/*

 -> Envoyer l'offre d'emission
 -> Reçoit un appel entrant

*/