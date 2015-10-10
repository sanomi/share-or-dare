angular.module('starter.controllers', [])

.controller('homeCtrl', function($scope, $http) {})

.controller('proposeCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

.controller('shareCtrl', function($scope) {
  
})

.controller('dareCtrl', function($scope, $http) {
  var ref = "http://localhost:3001/contactlist"
  var dares = $http.get(ref)
  console.log(dares);
});
