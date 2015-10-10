angular.module('starter.controllers', [])

  .controller('loginCtrl', function($scope, $http, $state) {

      $(function() {
      kandy.setup({

      });

    /** UIState is a custom piece of code that shuffles between UI states
     eg:: If user is authenticated, the relevant DOM elements are brought to screen
     and the rest are hidden. Using this method is NOT recommended!
     */

      var username, UIState = {};

      UIState.authenticated = function() {
      $('.username').text(username);
    };

      UIState.unauthenticated = function() {
      $('.username').text('');
    };

      UIState.initial = function() {
      console.log('initial');

      $audioRingIn[0].pause();
      $audioRingOut[0].pause();

      //$('#call-form p, #incoming-call p, #call-connected p').text('');
      //$('#incoming-call, #call-connected, .call-terminator, #resume-call-btn').addClass('hidden');
      //$('#call-form, .call-initializer').removeClass('hidden')
    };
      // Event handler for login form button
      var userArray = [];
      $('#login-btn').on('click', function(e) {
      e.preventDefault();

      // Values extracted from login form
      username = $('#username').val();
      var apiKey = $('#api_key').val();
      var password = $('#password').val();

    /** login(domainApiId, userName, password,success,failure)
     logs in user to Kandy Platform
     @params <string> domainApiId, <string> userName, <string> password, <function> success/failure
     */
      kandy.login(apiKey, username, password,function(msg){

      userArray.push(username);
      kandy.getLastSeen(userArray);
          $state.go('tab.home');
      //UIState.authenticated();
    },
      function(msg){
      alert('Login Failed!');
    });
    });// Event handler for logout button
      $('#logout-btn').on('click', function(e) {
      e.preventDefault();
    /** logout(success) logs a user out of the Kandy Platform
     @param <function> success - Callback handler for
     successful logout
     */
      kandy.logout(function() {
      userArray.push(username);
      kandy.getLastSeen(userArray);
      UIState.unauthenticated();
    });
    });
    });



  })

  .controller('homeCtrl', function($scope, $http) {
    // var ref = "http://localhost:3000/truths";
    // $scope.truth = $http.get(ref);
    // var ref = "http://localhost:3000/dares";
    // $scope.dare = $http.get(ref);
  })

  // .controller('proposeCtrl', function($scope) {
  // })

  // .controller('shareCtrl', function($scope, $http) {
  //   var ref = "http://localhost:3000/truths";
  //   $scope.truth = $http.get(ref);
  //   console.log(truth);
  // })

  // .controller('dareCtrl', function($scope, $http) {
  //   var ref = "http://localhost:3000/dares";
  //   $scope.dare = $http.get(ref);
  //   console.log($scope.dare);
  // });
  .controller('chatCtrl', function($scope,$http){
    // var ref = 'http://localhost:3000/chat';
    // $scope.dare = $http.get(ref);
  })
