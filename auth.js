const passport = require('passport')
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')
const GitHubStrategy = require('passport-github').Strategy

module.exports = function (app, myDataBase) {
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      if (err) return console.error(err)
      done(null, doc)
    })
  })

  passport.use(new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          'https://shrouded-badlands-17118.herokuapp.com/auth/github/callback'
      },
      function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
          return cb(err, user)
        })
      }
    )
  )

  passport.use(
    new LocalStrategy(function (username, password, done) {
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log('User ' + username + ' attempted to log in.')
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }
        if (password !== user.password) {
          return done(null, false)
        }
        return done(null, user)
      })
    })
  )
}
