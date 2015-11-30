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
    currentOver: currentOver
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
      runs: 0,
      wickets: 0,
      overs: -1, // So that we start with over 0.1
      balls: 0
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
    ss.currentOver = [];
    ss.overs.push(ss.over);
  };

  function newBall(bowlerId, batsmanId, batRuns, wicket, extraRuns, extraType) {
    ss.currentInnings.balls ++;
    ss.ball = new Ball(ss.currentInnings, bowlerId, batsmanId, batRuns, wicket, extraRuns, extraType);
    ss.balls.push(ss.ball);
    ss.currentOver.push(ss.ball);
    ss.currentInnings.runs += (batRuns + extraRuns);
    ss.currentInnings.wickets += wicket;
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
