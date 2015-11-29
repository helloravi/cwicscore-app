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
        score: 0
      },
      two: {
        name: 'Bat 2',
        score: 0
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

    (s.onStrike === s.bats.one) ? s.bats.one.score += batRuns : s.bats.two.score += batRuns;

    if (batRuns%2 != 0) { rotateStrike() };
    if (s.balls.length >= 6) { s.overFinished = true };

  };

  s.newOver = function() {
    if (s.balls.length >= 6) {
      s.balls = [];
      dataservice.newOver();
      s.overFinished = false;
      setScores();
      rotateStrike();
    };
  };

  init();

};