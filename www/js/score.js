angular.module('cwicscore').controller('ScoreCtrl', ScoreCtrl);

ScoreCtrl.$inject = ['dataservice'];

function ScoreCtrl(dataservice) {
  var s = this;

  function init() {

    dataservice.newMatch();

    s.over = dataservice.currentOver();
    s.legalBalls = 0;
    s.currentInnings = dataservice.currentInnings();

    s.bats = {
      one: {
        name: dataservice.currentMatch().info.teams[0].players[0],
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        sr: 0
      },
      two: {
        name: dataservice.currentMatch().info.teams[0].players[1],
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

    s.onStrike = s.bats.one;
    s.matchEquation = "Match Ready to Start";
    resetExtras();
    setScores();
  };

  function resetExtras() {
    s.nb = false;
    s.wd = false;
    s.lb = false;
    s.b = false;
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
      return 0.00;
    }
  };

  function setScores() {
      s.currentInnings.runs = dataservice.currentInnings().runs;
      s.currentInnings.wickets = dataservice.currentInnings().wickets;
      s.over = dataservice.currentOver();
  };

  function rotateStrike() {
    if (s.onStrike === s.bats.one) {
      s.onStrike = s.bats.two;
    } else {
      s.onStrike = s.bats.one;
    }
  };
  
  s.score = function(batRuns, wickets) {
    var bat = s.onStrike;
    var wickets = wickets || 0;
    var extraRuns = 0;
    var extraType = '';

    if (s.lb) {
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'lb';
    }
    else if (s.b) {
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'b';
    };

    if (s.nb) {
      extraRuns += 1; // Todo: Add option to set number of runs for no ball
      extraType = 'nb';
    }
    else if (s.wd) {
      extraRuns += 1;
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'wd';
    };

    dataservice.newBall(bat, s.bowler, batRuns, wickets, extraRuns, extraType);

    setScores();
   
    bat.runs += batRuns;
    bat.balls += 1;
    bat.sr = strikeRate(bat.runs, bat.balls);
    if (batRuns === 4) { bat.fours += 1};
    if (batRuns === 6) { bat.sixes += 1};

    if (batRuns%2 != 0) { rotateStrike() }; // Fix for extras

    if (!s.nb && !s.wd) { s.legalBalls += 1 };
    if (s.legalBalls >= 6) { s.overFinished = true };

    resetExtras();
    s.matchEquation = "Current Run Rate: " + runRate(s.currentInnings.runs, s.currentInnings.overs, s.currentInnings.balls);
  };

  s.newOver = function() { 
    dataservice.newOver();
    setScores();
    rotateStrike();
    s.over = [];
    s.legalBalls = 0;
    s.overFinished = false;
  };

  init();

};