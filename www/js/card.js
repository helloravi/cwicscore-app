angular.module('cwicscore').controller('CardCtrl', CardCtrl);

CardCtrl.$inject = ['dataservice'];

function CardCtrl(dataservice) {
  var c = this;

  function init() {

    dataservice.newMatch();

    c.over = dataservice.currentOver().deliveries;
    c.legalBalls = 0;
    c.currentInnings = dataservice.currentInnings();

    c.bats = {
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

    c.bowler = {
      name: 'Bowler',
      o: 0,
      m: 0,
      r: 0,
      w: 0,
      econ: 0
    };

    c.onStrike = c.bats.one;
    c.matchEquation = "Match Ready to Start";
    resetExtras();
    setScores();
  };

  function resetExtras() {
    c.nb = false;
    c.wd = false;
    c.lb = false;
    c.b = false;
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
      c.currentInnings.runs = dataservice.currentInnings().runs;
      c.currentInnings.wickets = dataservice.currentInnings().wickets;
      c.over = dataservice.currentOver();
  };

  function rotateStrike() {
    if (c.onStrike === c.bats.one) {
      c.onStrike = c.bats.two;
    } else {
      c.onStrike = c.bats.one;
    }
  };
  
  c.score = function(batRuns, wickets) {
    var bat = c.onStrike;
    var wickets = wickets || 0;
    var extraRuns = 0;
    var extraType = '';

    if (c.lb) {
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'lb';
    }
    else if (c.b) {
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'b';
    };

    if (c.nb) {
      extraRuns += 1; // Todo: Add option to set number of runs for no ball
      extraType = 'nb';
    }
    else if (c.wd) {
      extraRuns += 1;
      extraRuns += batRuns;
      batRuns = 0;
      extraType = 'wd';
    };

    dataservice.newBall(bat, c.bowler, batRuns, wickets, extraRuns, extraType);

    setScores();
   
    bat.runs += batRuns;
    bat.balls += 1;
    bat.sr = strikeRate(bat.runs, bat.balls);
    if (batRuns === 4) { bat.fours += 1};
    if (batRuns === 6) { bat.sixes += 1};

    if (batRuns%2 != 0) { rotateStrike() }; // Fix for extras

    if (!c.nb && !c.wd) { c.legalBalls += 1 };
    if (c.legalBalls >= 6) { c.overFinished = true };

    resetExtras();
    c.matchEquation = "Current Run Rate: " + runRate(c.currentInnings.runs, c.currentInnings.overs, c.currentInnings.balls);
  };

  c.newOver = function() { 
    dataservice.newOver();
    setScores();
    rotateStrike();
    c.over = [];
    c.legalBalls = 0;
    c.overFinished = false;
  };

  init();

};