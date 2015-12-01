angular.module('cwicscore').config(cwicscoreConfig);

function cwicscoreConfig($stateProvider, $urlRouterProvider) {
  $stateProvider.state('score', {
    url: '/score',
    templateUrl: 'templates/score.html',
    controller: 'ScoreCtrl',
    controllerAs: 's'
  });

  $stateProvider.state('card', {
    url: '/card',
    templateUrl: 'templates/card.html',
    controller: 'CardCtrl',
    controllerAs: 'c'
  });

  $stateProvider.state('teams', {
    url: '/teams',
    templateUrl: 'templates/teams.html',
    controller: 'TeamCtrl',
    controllerAs: 't'
  });

  $stateProvider.state('options', {
    url: '/options',
    templateUrl: 'templates/options.html',
    controller: 'OptionCtrl',
    controllerAs: 'o'
  });

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl',
    controllerAs: 'set'
  });

  $urlRouterProvider.otherwise('/score');
};