const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const yahooClientId = `dj0yJmk9R2thdHVtdUxZcm9xJmQ9WVdrOVVUaHNSWEpGUzNJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWZm`
const yahooClientSecret = `f0aeda8007a34a9568556daaac93cbf67914a3fb`
const yahooCallbackUrl = `http://localhost:3001/auth/yahoo/callback`
const axios = require('axios')

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new OAuth2Strategy({
  authorizationURL: `https://api.login.yahoo.com/oauth2/request_auth_fe?client_id=${yahooClientId}&redirect_uri=${yahooCallbackUrl}&response_type=code&language=en-us`,
  tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
  clientID: yahooClientId,
  clientSecret: yahooClientSecret,
  callbackURL: yahooCallbackUrl,
  scope: 'fspt-w',
},
  async function (accessToken, refreshToken, profile, cb) {
    let authHead = `Bearer ${accessToken}`
    console.log('Access token:', accessToken)
    console.log('Refresh token:', refreshToken)
    console.log('Profile:', profile)
    var profile = await axios.get('https://social.yahooapis.com/v1/user/me/profile?format=json', {
      headers: {
        Authorization: authHead
      }
    })
      .then((res) => {

        res = res.json()
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }))

module.exports = passport;