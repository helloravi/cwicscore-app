angular.module('cwicscore.data', [])
       .factory('dataservice', dataservice);

function dataservice() {
  var ss = this;

  var service = {
    newMatch: newMatch,
    newInnings: newInnings,
    newOver: newOver,
    newBall: newBall,
    currentMatch: currentMatch,
    currentInnings: currentInnings,
    currentOver: currentOver,
    // currentBatsmen: currentBatsmen,
    // currentBowler: currentBowler
  };

  return service;

  function newMatch(teamOneName, teamTwoName, venue, battingFirst) {
    ss.teamOne = {
      name: teamOneName || 'Team A',
      players: [
        'Sundar',
        'Guru',
        'player3',
        'player4',
        'player5',
        'player6',
        'player7',
        'player8',
        'player9',
        'player10',
        'player11'
        ]
    };
    ss.teamTwo = {
      name: teamTwoName || 'Team B',
      players: [
        'player1',
        'player2',
        'player3',
        'player4',
        'player5',
        'player6',
        'player7',
        'player8',
        'player9',
        'player10',
        'player11'
        ]
    };
    ss.currentMatch = {
      info: {
        venue: venue || '',
        date: new Date(),
        teams: [ss.teamOne, ss.teamTwo]
      }
    };
    
    ss.match = new Match(ss.teamOne, ss.teamTwo, venue);
    
    ss.balls = [];
    ss.overs = [];
    ss.inningss = [];
    newInnings(battingFirst || ss.teamOne);
  };

  function newInnings(battingTeam, bowlingTeam) {
    ss.currentInnings = {
      order: 1,
      battingTeam: battingTeam || ss.teamOne,
      bowlingTeam: bowlingTeam || ss.teamTwo,
      matchEquation: 'Match Ready to Start',
      runs: 0,
      wickets: 0,
      overs: -1, // So that we start with over 0.1
      balls: 0,
      batOne: {
        name: 'Sangram',
        onStrike: true,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        sr: function() {
          return strikeRate(this.runs, this.balls)
        }
      },
      batTwo: {
        name: 'Guru',
        onStrike: false,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        sr: function() {
          return strikeRate(this.runs, this.balls)
        }
      },
      bowler: {
        name: 'Bowler',
        o: 0,
        m: 0,
        r: 0,
        w: 0,
        econ: 0
      },
      runRate: function() {
        return runRate(this.runs, this.overs, this.balls);
      }
    };

    ss.innings = new Innings(ss.currentInnings.order, (battingTeam || 'Team 1'));
    ss.inningss.push(ss.innings);
    console.log(ss.battingTeam);

    newOver();
  };

  function newOver() {
    ss.currentInnings.overs ++;
    ss.currentInnings.balls = 0;
    ss.over = new Over(ss.currentInnings.overs, 'Pavillion End');
    ss.currentOver = {
      deliveries: [],
      legalDeliveries: 0
    };
    ss.overs.push(ss.over);
  };

  function newBall(bowlerId, batsman, batRuns, nonStriker, wicket, extraRuns, extraType) {
    ss.currentInnings.balls ++;
    ss.ball = new Ball(ss.currentInnings, bowlerId, batsman, batRuns, nonStriker, wicket, extraRuns, extraType);
    ss.balls.push(ss.ball);

    updateBatScore(batsman, batRuns);

    ss.currentOver.deliveries.push(ss.ball);
    ss.currentInnings.runs += (batRuns + extraRuns);
    ss.currentInnings.wickets += wicket;
    ss.currentInnings.matchEquation = "Current Run Rate: " + ss.currentInnings.runRate();
    if (extraType != ('nb' || 'wd')) { ss.currentOver.legalDeliveries += 1 };
    if (batRuns%2 != 0) { rotateStrike() }; // Fix for extras
  };

  function updateBatScore(batsman, runs) {
    batsman.runs += runs;
    batsman.balls += 1;
    if (runs === 4) { batsman.fours += 1};
    if (runs === 6) { batsman.sixes += 1};
  }

  function rotateStrike() {
    ss.currentInnings.batOne.onStrike = !ss.currentInnings.batOne.onStrike;
    ss.currentInnings.batTwo.onStrike = !ss.currentInnings.batTwo.onStrike;
  };

  function runRate(runs, overs, balls) {
    if (balls > 0) {
      var overs = overs + (balls / 6);
      return Number(Math.round((runs / overs)+'e2')+'e-2').toFixed(2);
    } else {
      return 0.00;
    }
  };

  function strikeRate(runs, balls) {
    if (balls > 0) {
      return Math.round((runs / balls) * 100);
    } else {
      return 0;
    }
  };

  function currentMatch() {
    return ss.currentMatch;
  };

  function currentInnings() {
    return ss.currentInnings;
  };

  function currentOver() {
    return ss.currentOver;
  };

  function Match(venue, homeTeam, awayTeam) {
    this.venue = venue;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
  };

  function Innings(order, battingTeam) {
    this.order = order; // Order of innings in match
    this.battingTeam = battingTeam;
  };

  function Over(number, end) {
    this.number = number;
    this.end = end;
  };

  function Ball(ballId, bowlerId, batsmanId, batRuns, nonStriker, wicket, extraRuns, extraType, overId, inningsId) {
    this.ballId = ballId;
    this.bowler = bowlerId;
    this.batsman = batsmanId;
    this.batRuns = batRuns;
    this.nonStriker = nonStriker;
    this.wicket = wicket;
    this.extraRuns = extraRuns;
    this.extraType = extraType;
    this.over = overId;
    this.innings = inningsId;
  };

};
