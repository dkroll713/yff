const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const port = 3001;

const parseString = require('xml2js').parseString;

const cf = require('../config.js')
const { getOwners, processWeek, getAIText } = require('./routes/roster.js')

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
  res.send(200)
})

app.post('/auth/yahoo', (req, res) => {
  token = req.headers.authorization
  console.log('token:', token)
  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/games;game_codes=nfl;seasons=2023`
  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/423.l.480220/scoreboard`
  let week = 1;
  let completionObj = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false
  }
  let rostersObj = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null
  }

  getOwners()
    .then((owners) => {
      console.log('Owner res:', owners)
      let team1 = processWeek(week, 1, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team2 = processWeek(week, 2, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team3 = processWeek(week, 3, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team4 = processWeek(week, 4, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team5 = processWeek(week, 5, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team6 = processWeek(week, 6, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team7 = processWeek(week, 7, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team8 = processWeek(week, 8, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team9 = processWeek(week, 9, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team10 = processWeek(week, 10, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team11 = processWeek(week, 11, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

      let team12 = processWeek(week, 12, token)
        .then((res) => {
          rostersObj[res.team] = res.roster;
          completionObj[res.team] = true;

          if (checkAllComplete(completionObj, rostersObj, owners)) {
            console.log('All teams complete');
            printRosterObj(rostersObj)
          }
        })
        .catch((err) => {
          console.log('err:', err);
        });

    })

  // processWeek(week, 2, token)
  // processWeek(week, 3, token)
  // processWeek(week, 4, token)
  // processWeek(week, 5, token)
  // processWeek(week, 6, token)
  // processWeek(week, 7, token)
  // processWeek(week, 8, token)
  // processWeek(week, 9, token)
  // processWeek(week, 10, token)
  // processWeek(week, 11, token)
  // processWeek(week, 12, token)
  //   week++
  //   setTimeout(() => {
  //     console.log('waiting 5 seconds')
  //   }, 5000)
  // }


  res.send(200)

  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.11/roster;week=17`
  // let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.12/roster`

  // axios.get(url, {
  //   headers: {
  //     Authorization: `${token}`
  //   }
  // })
  //   .then((response) => {
  //     console.log('[YFF] Success')
  //     parseString(response.data, (err, result) => {
  //       // console.log(result.fantasy_content.games[0].game)
  //       let players = result.fantasy_content.team[0].roster[0]
  //       // let players = result.fantasy_content.team[0].roster[0].players[0].player
  //       console.log('manager:', players)
  //       // for (let x = 0; x < players.length; x++) {
  //       //   let player = players[x]
  //       //   // console.log(player)
  //       //   console.log('[YFF] Player name:', player.name[0].full)
  //       //   console.log('[YFF] Eligible positions:', player.eligible_positions[0])
  //       //   console.log('[YFF] Selected Positions:', player.selected_position)
  //       // }
  //     })
  //     res.send(200)
  //   })
  //   .catch((err) => {
  //     console.log('[YFF] Error')
  //     console.log(err)
  //     res.send(400)
  //   });
})

const checkAllComplete = (obj, rosters, owners) => {
  let complete = true;
  for (let key in obj) {
    if (obj[key] === false) {
      complete = false;
    }
  }

  if (complete) {
    // console.log('Rosters:', rosters)
    let nicknames = [];
    let msg = ``
    for (let key in rosters) {
      let roster = rosters[key];
      let id = roster.team;
      if (roster['NP'].length > 0) {
        // msg += `@${owners[id - 1].groupme_nickname} has ${roster['NP'].length} players on bye this week: ${roster['NP'].join(', ')}\n\n`
        let text = getAIText(owners[id - 1].groupme_nickname)
        text.then((insult) => {
          console.log('Insult:', insult)
          axios.post('https://api.groupme.com/v3/bots/post', {
            bot_id: cf.test_bot_id,
            text: insult
          })
        })
      }
      setTimeout(() => {

      }, [1000])
    }
    // axios.post('https://api.groupme.com/v3/bots/post', {
    //   bot_id: cf.test_bot_id,
    //   text: msg
    // })
  }
  return complete;
}

const printRosterObj = (obj) => {
  // console.log('Rosters:', obj);
}

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