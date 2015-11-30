angular.module('cwicscore').controller('ScoreCtrl', ScoreCtrl);

ScoreCtrl.$inject = ['dataservice'];

function ScoreCtrl(dataservice) {
  var s = this;

  function init() {

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
      name: 'Bowler',
      o: 0,
      m: 0,
      r: 0,
      w: 0,
      econ: 0
    };

    s.currentInnings = dataservice.currentInnings();
    // s.bowlingTeam = dataservice.awayTeam;
    s.venue = dataservice.venue;
    s.onStrike = s.bats.one;

    s.matchEquation = "Match Ready to Start";

    setScores();
  };

  function strikeRate(runs, balls) {
    if (balls > 0) {
      return Math.round((runs / balls) * 100);
    } else {
      return 0;
    }
  };

  function runRate(runs, overs, balls) {
    if (balls > 0) {
      var overs = overs + (balls / 6);
      return Number(Math.round((runs / overs)+'e2')+'e-2').toFixed(2);
    } else {
      return 0;
    }
  }

  function setScores() {
      s.currentInnings.runs = dataservice.currentInnings().runs;
      s.currentInnings.wickets = dataservice.currentInnings().wickets;
  };

  function rotateStrike() {
    if (s.onStrike === s.bats.one) {
      s.onStrike = s.bats.two;
    } else {
      s.onStrike = s.bats.one;
    }
  };
  
  s.score = function(batRuns, wickets, extraRuns, extrasType) {
    var bat = s.onStrike;
    wickets = wickets || 0;
    dataservice.newBall(bat, s.bowler, batRuns, wickets, 0);
    s.balls.push(batRuns);
    setScores();

    bat.runs += batRuns;
    bat.balls += 1;
    bat.sr = strikeRate(bat.runs, bat.balls);
    if (batRuns === 4) { bat.fours += 1};
    if (batRuns === 6) { bat.sixes += 1};

    if (batRuns%2 != 0) { rotateStrike() };
    if (s.balls.length >= 6) { s.overFinished = true };

    s.matchEquation = "Current Run Rate: " + runRate(s.currentInnings.runs, s.currentInnings.overs, s.currentInnings.balls);
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