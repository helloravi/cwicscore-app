angular.module('cwicscore').controller('TeamCtrl', TeamCtrl);

ScoreCtrl.$inject = ['dataservice'];

function TeamCtrl(dataservice) {
  var t = this;

  dataservice.newMatch(); // Need to work out where to put this
  t.reordering = false;
  t.players = dataservice.currentMatch().info.teams[0].players;

  t.remove = function(noteId) {
    dataservice.deleteNote(noteId);
  };

  t.move = function(note, fromIndex, toIndex) {
    dataservice.move(note, fromIndex, toIndex);
  };

  t.toggleReordering = function() {
    list.reordering = !list.reordering;
  };


};