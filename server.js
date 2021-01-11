'use strict'
require('dotenv').config()
const express = require('express')
const myDB = require('./connection')
const fccTesting = require('./freeCodeCamp/fcctesting.js')
const passport = require('passport')
const session = require('express-session')

// start
const app = express()

// passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'pug')
fccTesting(app) //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.route('/').get((req, res) => {
  res.render(process.cwd() + '/views/pug/index.pug', {
    title: 'Hello',
    message: 'Please login'
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT)
})
