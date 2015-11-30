angular.module('cwicscore').controller('ScoreCtrl', ScoreCtrl);

ScoreCtrl.$inject = ['dataservice'];

function ScoreCtrl(dataservice) {
  var s = this;

  var init = function() {

    dataservice.newMatch();
    s.balls = [];

    s.bats = {
      one: {
        name: 'Bat 1',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        sr: 0
      },
      two: {
        name: 'Bat 2',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        sr: 0
      }
    };

    s.bowler = {
      name: 'Bowler'
    };

    s.home = dataservice.homeTeam;
    s.away = dataservice.awayTeam;
    s.venue = dataservice.venue;
    s.battingTeam = dataservice.battingTeam;
    s.onStrike = s.bats.one;

    setScores();
  };

  function getStrikeRate(runs, balls) {
      if (balls > 0) {
        return Math.round((runs / balls) * 100);
      } else {
        return 0;
      }
    };

  var setScores = function() {
    if (dataservice.battingTeam === 'home') {
      s.homeScore = dataservice.homeRuns + " for " + dataservice.homeWickets;
      s.awayScore = 'Yet to Bat';
    } else {
      s.awayScore = dataservice.awayRuns + " for " + dataservice.awayWickets;
      s.homeScore = 'Yet to Bat';
    };
    
  };

  var rotateStrike = function() {
    if (s.onStrike === s.bats.one) {
      s.onStrike = s.bats.two;
    } else {
      s.onStrike = s.bats.one;
    }
  }; 
  
  s.score = function(batRuns, wickets, extraRuns, extrasType) {
    wickets = wickets || 0;
    dataservice.newBall(s.onStrike, s.bowler, batRuns, wickets, 0);
    s.balls.push(batRuns);
    setScores();

    (s.onStrike === s.bats.one) ? s.bats.one.runs += batRuns : s.bats.two.runs += batRuns;
    (s.onStrike === s.bats.one) ? s.bats.one.balls += 1 : s.bats.two.balls += 1;
    (s.onStrike === s.bats.one) ? s.bats.one.sr = getStrikeRate(s.bats.one.runs, s.bats.one.balls) : s.bats.two.sr = getStrikeRate(s.bats.two.runs, s.bats.two.balls);

    if (batRuns%2 != 0) { rotateStrike() };
    if (s.balls.length >= 6) { s.overFinished = true };

  };

  s.newOver = function() { 
    dataservice.newOver();
    setScores();
    rotateStrike();
    s.balls = [];
    s.overFinished = false;
  };

  s.extras = function(type) {

  };

  init();

};