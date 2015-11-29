angular.module('cwicscore.data', [])
       .factory('dataservice', dataservice);

function dataservice() {
  var ss = this;

  var service = {
    newMatch: newMatch,
    newInnings: newInnings,
    newOver: newOver,
    newBall: newBall
  };

  return service;

  function newMatch(home, away, venue, battingTeam) {
    ss.match = new Match(home, away, venue);
    ss.homeTeam = home || 'Home Team';
    ss.awayTeam = away || 'Away Team';
    ss.venue = venue || '';
    ss.currentInnings = 0;
    ss.currentRuns = 0;
    ss.currentWickets = 0;
    ss.balls = [];
    ss.overs = [];
    ss.inningss = [];
    newInnings(battingTeam);
  };

  function newInnings(battingTeam) {
    ss.currentInnings ++;
    ss.currentOver = 0;
    ss.innings = new Innings(ss.currentInnings, (battingTeam || 'Team 1'));
    ss.battingTeam = battingTeam || 'Team 1';
    ss.inningss.push(ss.innings);
    console.log(ss.battingTeam);

    if (ss.battingTeam === 'home') {
      ss.homeRuns = 0;
      ss.homeWickets = 0;
    } else {
      ss.awayRuns = 0;
      ss.awayWickets = 0;
    }

    newOver();
  };

  function newOver() {
    ss.currentOver ++;
    ss.currentBall = 0;
    ss.over = new Over(ss.currentOver, 'Pavillion End');
    ss.overs.push(ss.over);
  };

  function newBall(bowlerId, batsmanId, batRuns, wicket, extraRuns, extraType) {
    ss.currentBall ++;
    ss.ball = new Ball(ss.currentBall, bowlerId, batsmanId, batRuns, wicket, extraRuns,
                                 extraType, ss.currentOver, ss.currentInnings);
    ss.balls.push(ss.ball);

    if (ss.battingTeam === 'home') {
      ss.homeRuns += (batRuns + extraRuns);
      ss.homeWickets += wicket;
    } else {
      ss.awayRuns += (batRuns + extraRuns);
      ss.awayWickets += wicket;
    };

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

  function Ball(ballId, bowlerId, batsmanId, batRuns, wicket, extraRuns, extraType, overId, inningsId) {
    this.ballId = ballId;
    this.bowler = bowlerId;
    this.batsman = batsmanId;
    this.batRuns = batRuns;
    this.wicket = wicket;
    this.extraRuns = extraRuns;
    this.extraType = extraType;
    this.over = overId;
    this.innings = inningsId;
  };

};
