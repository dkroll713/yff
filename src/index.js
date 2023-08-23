const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
// const passport = require('./passport.js');
const port = 3001;
let token

var parseString = require('xml2js').parseString;

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.send(200)
})

app.post('/auth/yahoo', (req, res) => {
  token = req.headers.authorization
  console.log('token:', token)
  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/games;game_codes=nfl;seasons=2020`
  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/423.l.480220/scoreboard`
  let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.533640.t.12/roster;week=4`
  axios.get(url, {
    headers: {
      Authorization: `${token}`
    }
  })
    .then((response) => {
      console.log('[YFF] Success')
      parseString(response.data, (err, result) => {
        // console.log(result.fantasy_content.games[0].game)
        let players = result.fantasy_content.team[0].roster[0].players[0].player
        console.log('players:', players)
        for (let x = 0; x < players.length; x++) {
          let player = players[x]
          // console.log(player)
          console.log('[YFF] Player name:', player.name[0].full)
          console.log('[YFF] Eligible positions:', player.eligible_positions[0])
          console.log('[YFF] Selected Positions:', player.selected_position)
        }
      })
      res.send(200)
    })
    .catch((err) => {
      console.log('[YFF] Error')
      console.log(err)
      res.send(400)
    });
})
/*
 the league:
  let url = `https://fantasysports.yahooapis.com/fantasy/v2/games;game_codes=nfl;seasons=2023`
  console.log(result.fantasy_content.games[0].game)

  league standings:
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/423.l.480220/standings`
    console.log(result.fantasy_content.league[0].standings[0].teams[0].team)

  league settings:
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/423.l.480220/settings`
    console.log(result.fantasy_content.league[0].settings[0])

  league scoreboard:
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/423.l.480220/scoreboard`
    console.log(result.fantasy_content.league[0].scoreboard[0].matchups[0].matchup[0].teams[0])

  team rosters:
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.1/roster`
    console.log(result.fantasy_content.team[0].roster[0].players[0].player)

*/

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})