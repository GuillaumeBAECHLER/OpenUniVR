const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')


app.use(bodyParser.json())
app.use(cors())

app.use(express.static('../dist'));

app.post('/api/login', async (req, res) => {
  const data = req.body
  const response = await login(data.email, data.password)
  if (response.length == 0) {
    res.sendStatus(401)
  } else {
    res.status(200).json(response[0])
  }
});

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

function login(email, password) {
  return new Promise( ( resolve, reject ) => {
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

connection.query('SELECT email, lastname, firstname FROM account', function (error, results, fields) {
  if (error) throw error;
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