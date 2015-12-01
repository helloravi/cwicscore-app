angular.module('cwicscore').controller('ScoreCtrl', ScoreCtrl);

ScoreCtrl.$inject = ['dataservice'];

function ScoreCtrl(dataservice) {
  var s = this;

  function init() {

    dataservice.newMatch();
    s.currentInnings = dataservice.currentInnings();    
    s.over = dataservice.currentOver();

    s.bats = {
      one: s.currentInnings.batOne,
      two: s.currentInnings.batTwo
    };

    s.bowler = s.currentInnings.bowler;

    s.onStrike = s.currentInnings.batOne.onStrike ? s.currentInnings.batOne : s.currentInnings.batTwo;
    
    resetExtras();
    setScores();
  };

  function resetExtras() {
    s.nb = false;
    s.wd = false;
    s.lb = false;
    s.b = false;
  };

  function setScores() {
      s.currentInnings = dataservice.currentInnings();
      s.over = dataservice.currentOver();
      s.onStrike = s.currentInnings.batOne.onStrike ? s.currentInnings.batOne : s.currentInnings.batTwo;
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

    dataservice.newBall(s.bowler, bat, batRuns, s.currentInnings.nonStriker, wickets, extraRuns, extraType);

    setScores();
    resetExtras();

    if (s.over.legalDeliveries >= 6) { s.overFinished = true }; // Fix option for balls in over
   
    
  };

  s.newOver = function() { 
    dataservice.newOver();
    setScores();
    s.over = [];
    s.legalBalls = 0;
    s.overFinished = false;
  };

  init();

};