angular.module('starter.controllers', [])

  .controller('loginCtrl', function($scope, $http) {

  })

  .controller('homeCtrl', function($scope, $http) {
    var ref = "http://localhost:3000/truths";
    $scope.truth = $http.get(ref);
    var ref = "http://localhost:3000/dares";
    $scope.dare = $http.get(ref);
  })

  .controller('proposeCtrl', function($scope) {
  })

  .controller('shareCtrl', function($scope, $http) {
    var ref = "http://localhost:3000/truths";
    $scope.truth = $http.get(ref);
    console.log(truth);
  })

  .controller('dareCtrl', function($scope, $http) {
    var ref = "http://localhost:3000/dares";
    $scope.dare = $http.get(ref);
    console.log($scope.dare);
  });
