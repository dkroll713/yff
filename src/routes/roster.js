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

let monthlySchedule = {
  1: '9/4',
  2: '9/11',
  3: '9/18',
  4: '9/25',
  5: '10/2',
  6: '10/9',
  7: '10/16',
  8: '10/23',
  9: '10/30',
  10: '11/6',
  11: '11/13',
  12: '11/20',
  13: '11/27',
  14: '12/4',
  15: '12/11',
  16: '12/18',
  17: '12/25',
  18: '1/1',
};

const compareDates = (schedule, target) => {
  let keys = Object.keys(schedule);
  for (let key of keys) {
    // console.log('Week:', key, 'Date:', schedule[key]);
    // console.log('Today:', target);
    if (target === schedule[key]) {
      console.log('Match found!');
      return key;
    }
  }
  return 0;
}

const processWeek = async (team, token) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    week = compareDates(monthlySchedule, `${month}/${day}`);
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
    if (week !== 0) {

      const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${cf.game_id}.l.${cf.league_id}.t.${team}/roster;week=${week}`;

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
          const name = player?.name[0]?.full[0];
          const bye = player?.bye_weeks[0]?.week[0];
          const eligiblePositions = player?.eligible_positions[0]?.position[0];
          const selectedPosition = player?.selected_position[0]?.position[0];
          console.log('~~~~~')
          console.log(`${name} bye week:`, bye, `Status: Eligible positions: ${eligiblePositions} Selected position: ${selectedPosition}`)
          try {
            weeklyRoster[selectedPosition].push(name);
            if (selectedPosition !== 'BN' && selectedPosition !== 'IR' && (player.status && player.status[0] !== 'Q' && player.status[0] !== 'D') || (bye && bye == week && selectedPosition !== 'BN' && selectedPosition !== 'IR')) {
              weeklyRoster['NP'].push(name);
            }
          } catch (err) {
            console.log('[YFF] Error creating roster object');
            console.log('Selected position not present on obj:', selectedPosition);
            console.log(err);
          }
        });

      });
      let obj = {
        roster: weeklyRoster,
        team: team,
      }
      weeklyRoster.team = team;
      return obj;
    } else {
      console.log('No match found for today\'s date');
      return null;
    }
  } catch (err) {
    console.log('[YFF] Error creating roster object.');
    console.log(err);
    throw err;
  }
};

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
          console.log('[YFF] Player name:', name)
          console.log('[YFF] Eligible positions:', eligiblePositions)
          console.log('[YFF] Selected Positions:', selectedPosition)
          try {
            weeklyRoster[selectedPosition].push(name)
          } catch (err) {
            console.log('[YFF] Error creating roster object')
            console.log('Selected position not present on obj:', selectedPosition)
            console.log(err)
          }
        })
        console.log(`Weekly roster for team ${team} in week ${week}:`, weeklyRoster)
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
  const owners = cf.members;
  return owners
}

module.exports.getOwners = getOwners

const getAIText = async (owner_nickname) => {

  const possiblePersonas = [
    // 'Hulk Hogan', 'Shia LaBeouf', 'Clint Eastwood', 'Arnold Schwarzenneger'
    'Dennis Reynolds in persona as the Golden God', 'Hulk Hogan', 'Hulk Hogan', 'Hulk Hogan'
  ]
  const personaIndex = Math.floor(Math.random() * possiblePersonas.length)

  console.log(`Crafting an insult for @${owner_nickname} using persona ${possiblePersonas[personaIndex]}...`)

  let url = `https://api.openai.com/v1/chat/completions`
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cf.ai_token}`
  }
  let body = {
    "model": "gpt-4o",
    "messages": [{
      "role": "user",
      "content": `Craft an extremely mean and personal insult for someone who hasn't set their fantasy football lineup after being reminded constantly. Don't user more than three sentences and use American swear words. Make it sound like it was said by a mixture of ${possiblePersonas[personaIndex]} and an absolute psychopath. Their name is @${owner_nickname}`
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