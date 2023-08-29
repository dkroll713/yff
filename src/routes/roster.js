const axios = require('axios');
const parseString = require('xml2js').parseString;
const cf = require('../../config.js')
const { Pool } = require('pg');
const pool = new Pool({
  user: cf.user,
  password: cf.password,
  host: cf.host,
  port: cf.db_port,
  database: cf.db
})

// let monthlySchedule = {
//   1: 'September 6, 2023',
//   2: 'September 13, 2023',
//   3: 'September 20, 2023',
//   4: 'September 27, 2023',
//   5: 'October 4, 2023',
//   6: 'October 11, 2023',
//   7: 'October 18, 2023',
//   8: 'October 25, 2023',
//   9: 'November 1, 2023',
//   10: 'November 8, 2023',
//   11: 'November 15, 2023',
//   12: 'November 22, 2023',
//   13: 'November 29, 2023',
//   14: 'December 6, 2023',
//   15: 'December 13, 2023',
//   16: 'December 20, 2023',
//   17: 'December 27, 2023',
// }

let monthlySchedule = {
  1: '9/06',
  2: '9/13',
  3: '9/20',
  4: '9/27',
  5: '10/04',
  6: '10/11',
  7: '10/18',
  8: '10/25',
  9: '11/01',
  10: '11/08',
  11: '11/15',
  12: '11/22',
  13: '11/29',
  14: '12/06',
  15: '12/13',
  16: '12/20',
  17: '12/27',
};

const processWeek = async (week, team, token) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weeklyRoster = {
      'QB': [],
      'RB': [],
      'WR': [],
      'TE': [],
      'W/R/T': [],
      'K': [],
      'DEF': [],
      'BN': [],
      'IR': [],
      'NP': [],
    };
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.${team}/roster;week=${week}`;

    console.log(`[YFF] Today's date: ${month}/${day}`);
    console.log(`[YFF] Entering process fn for team ${team} in week ${week}`);

    const res = await axios.get(url, {
      headers: {
        Authorization: `${token}`,
      },
    });

    parseString(res.data, (err, result) => {
      const players = result.fantasy_content.team[0].roster[0].players[0].player;
      players.map((player) => {
        const name = player.name[0].full[0];
        const eligiblePositions = player.eligible_positions[0].position[0];
        const selectedPosition = player.selected_position[0].position[0];

        try {
          weeklyRoster[selectedPosition].push(name);
          if (selectedPosition !== 'BN' && selectedPosition !== 'IR' && player.status && player.status[0] !== 'Q' && player.status[0] !== 'D') {
            weeklyRoster['NP'].push(name);
          }
        } catch (err) {
          console.log('[YFF] Error creating roster object');
          console.log('Selected position not present on obj:', selectedPosition);
          console.log(err);
        }
      });

      // console.log(`Weekly roster for team ${team} in week ${week}:`, weeklyRoster);
    });
    let obj = {
      roster: weeklyRoster,
      team: team,
    }
    weeklyRoster.team = team;
    return obj;
  } catch (err) {
    console.log('[YFF] Error creating roster object.');
    console.log(err);
    throw err;
  }
};

// const processWeek = (week, team, token) => {
//   let today = new Date()
//   let month = today.getMonth() + 1
//   let day = today.getDate()
//   let weeklyRoster = {
//     'QB': [],
//     'RB': [],
//     'WR': [],
//     'TE': [],
//     'W/R/T': [],
//     'K': [],
//     'DEF': [],
//     'BN': [],
//     'IR': [],
//     'NP': [],
//   }
//   let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.${team}/roster;week=${week}`

//   console.log(`[YFF] Today's date: ${month}/${day}`)
//   console.log(`[YFF] Entering process fn for team ${team} in week ${week}`)

//   axios.get(url, {
//     headers: {
//       Authorization: `${token}`
//     }
//   })
//     .then((res) => {
//       parseString(res.data, (err, result) => {
//         let players = result.fantasy_content.team[0].roster[0].players[0].player
//         players.map((player) => {
//           let name = player.name[0].full[0]
//           let eligiblePositions = player.eligible_positions[0].position[0]
//           let selectedPosition = player.selected_position[0].position[0]
//           // console.log('[YFF] Player name:', name)
//           // console.log(player)
//           // console.log('[YFF] Eligible positions:', eligiblePositions)
//           // console.log('[YFF] Selected Positions:', selectedPosition)
//           try {
//             weeklyRoster[selectedPosition].push(name)
//             if (selectedPosition !== ('BN' || 'IR') && player.status) { //&& player.status[0] !== 'Q' && player.status[0] !== 'D') {
//               // console.log('[YFF] Player name:', name)
//               // console.log('[YFF] Player status:', player.status[0])
//               weeklyRoster['NP'].push(name)
//             }
//           } catch (err) {
//             console.log('[YFF] Error creating roster object')
//             console.log('Selected position not present on obj:', selectedPosition)
//             console.log(err)
//           }
//         })
//         console.log(`Weekly roster for team ${team} in week ${week}:`, weeklyRoster)
//       })
//       return weeklyRoster
//     })
//     .catch((err) => {
//       console.log('[YFF] Error creating roster object.')
//       console.log(err)
//     })
// }

const executeQuery = async (query, values = []) => {
  if (values.length > 1) {
    console.log('Values present:', values)
  } else {
    try {
      const result = await pool.query(query)
      return result.rows
    } catch (err) {
      throw err
    }
  }
}

const uploadRoster = (week, team, token) => {
  let today = new Date()
  let month = today.getMonth() + 1
  let day = today.getDate()
  console.log(`[YFF] Today's date: ${month}/${day}`)
  console.log(`[YFF] Entering process fn for team ${team} in week ${week}`)
  let weeklyRoster = {
    'QB': [],
    'RB': [],
    'WR': [],
    'TE': [],
    'W/R/T': [],
    'K': [],
    'DEF': [],
    'BN': [],
    'IR': []
  }
  let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/423.l.480220.t.${team}/roster;week=${week}`

  axios.get(url, {
    headers: {
      Authorization: `${token}`
    }
  })
    .then((res) => {
      parseString(res.data, (err, result) => {
        let players = result.fantasy_content.team[0].roster[0].players[0].player
        players.map((player) => {
          let name = player.name[0].full[0]
          let eligiblePositions = player.eligible_positions[0].position[0]
          let selectedPosition = player.selected_position[0].position[0]
          // console.log('[YFF] Player name:', name)
          // console.log('[YFF] Eligible positions:', eligiblePositions)
          // console.log('[YFF] Selected Positions:', selectedPosition)
          try {
            weeklyRoster[selectedPosition].push(name)
          } catch (err) {
            console.log('[YFF] Error creating roster object')
            console.log('Selected position not present on obj:', selectedPosition)
            console.log(err)
          }
        })
        // console.log(`Weekly roster for team ${team} in week ${week}:`, weeklyRoster)
        let values = [weeklyRoster, team, week]
        let query =
          `
            UPDATE weekly_roster set roster = $1 where team = $2 and week = $3;
          `
        pool.query(query, values)
          .then((res) => {
            console.log(`[YFF] Successfully updated roster for team ${team} in week ${week}`)
          })
          .catch((err) => {
            console.log('[YFF] Error updating roster')
            console.log(err)
          })
      })

    })
    .catch((err) => {
      console.log('[YFF] Error')
      console.log(err)
    })
}

module.exports.processWeek = processWeek

const getOwners = async () => {
  let query = 'SELECT * FROM owners order by id;'
  try {
    let owners = await executeQuery(query)
    return owners
  } catch (err) {
    console.log('[YFF] Error getting owners')
    console.log(err)
  }
}

module.exports.getOwners = getOwners

const getAIText = async (owner_nickname) => {
  let url = `https://api.openai.com/v1/chat/completions`
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cf.ai_token}`
  }
  let body = {
    "model": "gpt-4",
    "messages": [{
      "role": "user",
      "content": `Craft an extremely mean and personal insult for someone who hasn't set their fantasy football lineup after being reminded constantly. Don't user more than three sentences and use American swear words. Make it sound like it was said by a mixture of Hulk Hogan and an absolute psychopath. Their name is @${owner_nickname}`
    }],
    "temperature": 1
  }

  try {
    let res = await axios.post(url, body, { headers: headers })
    let text = res.data.choices[0].message.content
    // console.log('[YFF] AI text:', text)
    return text
  } catch (err) {
    console.log('[YFF] Error getting AI text')
    console.log(err)
  }
}

module.exports.getAIText = getAIText