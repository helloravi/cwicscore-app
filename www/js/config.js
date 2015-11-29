angular.module('cwicscore').config(cwicscoreConfig);

function cwicscoreConfig($stateProvider, $urlRouterProvider) {
  $stateProvider.state('score', {
    url: '/score',
    templateUrl: 'templates/score.html',
    controller: 'ScoreCtrl',
    controllerAs: 's'
  });

  $stateProvider.state('edit', {
    url: '/edit/:noteId',
    templateUrl: 'templates/edit.html',
    controller: 'EditCtrl',
    controllerAs: 'edit'
  });

  $urlRouterProvider.otherwise('/score');
};