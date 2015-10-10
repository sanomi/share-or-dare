

/** UIState is a custom piece of code that shuffles between UI states
 eg:: If user is authenticated, the relevant DOM elements are brought to screen
 and the rest are hidden. Using this method is NOT recommended!
 */

var username, UIState = {};
var apiKey = 'DAKa37c97c5a9fd472e94452cd5ac579d85';


angular.module('starter.controllers', [])

  .controller('loginCtrl', function($scope, $http, $state) {

      $(function() {
      kandy.setup({

      });

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
      var password = $('#password').val();

    /** login(domainApiId, userName, password,success,failure)
     logs in user to Kandy Platform
     @params <string> domainApiId, <string> userName, <string> password, <function> success/failure
     */
    kandy.login(apiKey, username, password,function(user_access_token){
      UIState.user_access_token = user_access_token;
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
      $(function() {

        var userArray = [];

        kandy.setup({

          // listeners registers events to handlers
          // You can handle all Kandy Events by registering it here
          listeners: {
            chatGroupMessage: onchatGroupMessage,
            chatGroupInvite: onchatGroupInvite,
            chatGroupBoot: onchatGroupBoot,
            chatGroupLeave: onchatGroupLeave,
            chatGroupUpdate: onchatGroupUpdate,
            chatGroupDelete: onchatGroupDelete
          }
        });

        // Event handler for onchatGroupInvite event
        function onchatGroupInvite(message) {
          if (message.length > 0) {
            var inviter = message.inviter;
            var groupId = message.group_id;

            kandy.messaging.getGroupById(groupId,

              function (results) {
                var groupName = results.group_name;
                groupNameArr = inviter.split("@");
                var LoggedUser = $(".username").text();
                if (groupNameArr[0] != LoggedUser)
                  alert("User : " + inviter + " is invited to this Group : " + groupName);
                fetchAllGroupNames();
              },
              function () {
                alert("Something went wrong when we did the search. Try again.");
              });
          }

        }

        // Event handler for onchatGroupBoot event
        function onchatGroupBoot(message) {
          console.log("onchatGroupBoot success");
        }

        // Event handler for onchatGroupLeave event
        function onchatGroupLeave(message) {
          var leaver = message.leaver;
          var groupId = message.group_id;
          kandy.messaging.getGroupById(groupId,

            function (results) {
              var groupName = results.group_name;
              groupNameArr = leaver.split("@");
              var LoggedUser = $(".username").text();
              if (groupNameArr[0] != LoggedUser)
                alert("User :" + leaver + " is left from this Group :" + groupName);
              else
                alert("You are removed from this Group : " + groupName);
              fetchAllGroupNames();
            },
            function () {
              alert('Something went wrong when we did the search. Try again.');
            });

        }

        // Event handler for onchatGroupUpdate event
        function onchatGroupUpdate(message) {
          if (message.length > 0) {
            var groupName = message.group_name;
            var groupId = message.group_id;
            fetchAllGroupNames();
            alert("GroupName was updated as : " + groupName);
          }
        }

        // Event handler for onchatGroupDelete event
        function onchatGroupDelete(message) {
          console.log("onchatGroupDelete :" + JSON.stringify(message));
          if (message.length > 0) {
            var eraser = message.eraser;
            var groupId = message.group_id;
            kandy.messaging.getGroupById(groupId,

              function (results) {
                var groupName = results.group_name;
                alert("User :" + eraser + " is deleted this Group :" + groupName);
                fetchAllGroupNames();
              },
              function () {
                alert('Something went wrong when we did the search. Try again.');
              });
          }

        }

        // Event handler for onchatGroupMessage event
        function onchatGroupMessage(message) {
          var msgType = message.messageType;
          var sendername = message.sender.user_id;

          if (msgType == "groupChat") {

            var contentType = message.contentType;
            if (contentType == "text") {

              var msgTextSend = message.message.text;

              var $chatItem = $('<div class="well1 text-left">');
              var $username = $('<h5>').text(sendername);
              var $message = $('<p>').text(msgTextSend);

              $chatItem.append($username, $message);
            } else if (contentType == "file") {
              var userToken = UIState.user_access_token;
              var fileName = message.message.content_name;
              var contentId = message.message.content_uuid;

              var downloadUrl = kandy.messaging.buildFileUrl(contentId);

              var $chatItem = $('<div class="well1 text-left">');
              var $content = $('<a href=' + downloadUrl + ' target="_blank">');
              var $username = $('<h5>').text(sendername);
              var $message = $content.text(fileName);

              $chatItem.append($username, $message);
            } else if (contentType == "image") {
              var userToken = UIState.user_access_token;
              var fileName = message.message.content_name;
              var contentId = message.message.content_uuid;
              var $chatItem = $('<div class="well1 text-left">');
              var downloadUrl = kandy.messaging.buildFileUrl(contentId);
              var $content = $('<a href=' + downloadUrl + ' target="_blank">');
              var $username = $('<h5>').text(sendername);
              var $message = $content.text(fileName);

              $chatItem.append($username, $message);
            } else if (contentType == "audio") {
              var userToken = UIState.user_access_token;
              var fileName = message.message.content_name;
              var contentId = message.message.content_uuid;
              var $chatItem = $('<div class="well1 text-left">');
              var downloadUrl = kandy.messaging.buildFileUrl(contentId);
              var $content = $('<a href=' + downloadUrl + ' target="_blank">');
              var $username = $('<h5>').text(sendername);
              var $message = $content.text(fileName);

              $chatItem.append($username, $message);
            } else if (contentType == "video") {
              var userToken = UIState.user_access_token;
              var fileName = message.message.content_name;
              var contentId = message.message.content_uuid;
              var $chatItem = $('<div class="well1 text-left">');
              var downloadUrl = kandy.messaging.buildFileUrl(contentId);
              var $content = $('<a href=' + downloadUrl + ' target="_blank">');
              var $username = $('<h5>').text(sendername);
              var $message = $content.text(fileName);

              $chatItem.append($username, $message);
            }
            $('#chat-messages').append($chatItem);
          }
        }

        String.prototype.isAlphaNumeric = function () {
          var regExp = /^[A-Za-z0-9_]+$/;
          return (this.match(regExp));
        };

        // Fetch User List on Selecting Groups in Dropdown
        $("#group-names-send").change(function () {
          var group_id = $("#group-names-send option:selected").val();
          fetchUserMembersGroupMessaging(group_id);
        });

        // Fetch User Members from the selected Groups in Messaging
        fetchUserMembersGroupMessaging = function (group_id) {
          if (group_id == "0") {
            $("#chatUserdata").hide();
            $("#groupHeading").hide();
            $('.sendMsgTextNoMember').show();
            $('#send_file').prop('disabled', true);
            $('#imFile').prop('disabled', true);
            $('#send_msg').prop('disabled', true);
          } else {

            kandy.messaging.getGroupById(group_id,

              function (results) {
                $('#chatUserdata').html("");
                var data = results.members;

                if (data.length) {
                  $("#chatUserdata").show();
                  $("#groupHeading").show();
                  $('.sendMsgTextNoMember').hide();

                  $('#chatUserdata').show();
                  $('#chat-message').removeAttr("readonly");
                  $('#send_msg').prop('disabled', false);
                  $('#send_file').prop('disabled', false);
                  $('#imFile').prop('disabled', false);

                  data.forEach(function (entry) {

                    var $listItem = $('<li class="clearfix" style="margin:5px;">');
                    var $username = $('<label class="pull-left" style="margin-right:10px;font-weight:normal;">' + entry.full_user_id + '</label>');
                    $listItem.append($username);
                    $('#chatUserdata').append($listItem);
                  });

                } else {

                  $('#chat-message').attr('readonly', 'true');
                  $('#send_msg').prop('disabled', true);
                  $('#send_file').prop('disabled', true);
                  $('#imFile').prop('disabled', true);
                  $('.sendMsgTextNoMember').show();
                  $('#chatUserdata').hide();
                }
              },
              function () {
                alert('Something went wrong when we did the search. Try again.');
              });
          }
        }

        $scope.initChat = function() {
          fetchAllGroupNames();
        };

        // Fetch All Groups created by the logged in User
        fetchAllGroupNames = function () {
          console.log('Getting groups');
          kandy.messaging.getGroups(
            function (results) {
              var tabId = "group-names-send";
              $('#' + tabId).html("");
              var groupList = results.groups;
              if (groupList) {
                var userArray = [];
                var attrHash = {
                  'data-user-type': "none",
                  'data-muted-type': "none"
                }
                var $option = $('<option>');
                $option.val(0).text("Select Group").attr(attrHash);
                $('#' + tabId).append($option);
                for (i = 0; i < results.groups.length; i++) {

                  var attrHash = {
                    'data-user-type': groupList[i].group_type,
                    'data-muted-type': groupList[i].muted
                  }
                  var $option = $('<option>');
                  $option.val(groupList[i].group_id).text(groupList[i].group_name).attr(attrHash);
                  $('#' + tabId).append($option);
                }
                fetchUserMembersGroupMessaging("0");
              } else {
                alert('Sorry, you have no groups created in your account');
              }
            },
            function () {
              alert('Error - something went wrong when we tried to fetch GroupList');
            }
          );
        }

        // Send Message to Selected Group
        sendImToGroup = function () {

          var selectedGrpObj = $("#group-names-send option:selected");
          var group_id = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          var msgText = $("#chat-message").val();
          kandy.messaging.sendGroupIm(group_id, msgText, onsendImToGroupSuccess, onsendImToGroupFailure);
        }

        // callback function for Success sendImToGroup
        onsendImToGroupSuccess = function (message) {

          var message = $('#chat-message').val();
          var selectedGrpObj = $("#group-names-send option:selected").val();
          var groupName = $("#group-names-send option:selected").text();
          $('#chat-message').val('');
          var $chatItem = $('<div class="well1 text-right">');
          var $username = $('<h5>').text($('.username').html());
          var $message = $('<p>').text(message);

          $chatItem.append($username, $message);
          $('#chat-messages').append($chatItem);
        }
        // callback function for failure sendImToGroup
        onsendImToGroupFailure = function (message) {

          console.log("onsendImToGroupFailure : " + JSON.stringify(message));
        }

        // Call Send Message Method on Click Send Button
        $('#send_msg').on('click', function () {
          sendImToGroup();
        });

        // Send File to Selected Group
        sendImWithFileToGroup = function () {

          var selectedGrpObj = $("#group-names-send option:selected");
          var group_id = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          var file = document.getElementById("imFile").files[0];
          kandy.messaging.sendGroupImWithFile(group_id, file, onsendImWithFileToGroupSuccess, onsendImWithFileToGroupFailure);
        }

        // callback function for Success sendImWithFileToGroup
        onsendImWithFileToGroupSuccess = function (message) {
          var fileName = "";
          var selectedGrpObj = $("#group-names-send option:selected").val();
          var groupName = $("#group-names-send option:selected").text();
          fileName = message.message.content_name;
          var $chatItem = $('<div class="well1 text-right">');
          var $username = $('<h5>').text($('.username').html());
          var $message = $('<p>').text(fileName);

          $('#imFile').val('');
          $chatItem.append($username, $message);
          $('#chat-messages').append($chatItem);
        }
        // callback function for failure sendImWithFileToGroup
        onsendImWithFileToGroupFailure = function (message) {

          console.log("onsendImWithFileToGroupFailure");
        }
        // Call Send File Method on Click Send Button
        $('#send_file').on('click', function () {

          var chatOption = $('input[name=chatRadioButton]:checked').val();
          if (chatOption == "sendFile")
            sendImWithFileToGroup();
          else if (chatOption == "sendImage")
            sendImWithImageToGroup();
          else if (chatOption == "sendAudio")
            sendImWithAudioToGroup();
          else if (chatOption == "sendVideo")
            sendImWithVideoToGroup();
        });

        // Send Image to Selected Group
        sendImWithImageToGroup = function () {

          var selectedGrpObj = $("#group-names-send option:selected");
          var group_id = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          var file = document.getElementById("imFile").files[0];
          kandy.messaging.sendGroupImWithImage(group_id, file, onsendImWithImageToGroupSuccess, onsendImWithImageToGroupFailure);
        }

        // callback function for Success sendImWithImageToGroup
        onsendImWithImageToGroupSuccess = function (message) {
          var fileName = "";
          var selectedGrpObj = $("#group-names-send option:selected").val();
          var groupName = $("#group-names-send option:selected").text();
          fileName = message.message.content_name;
          var $chatItem = $('<div class="well1 text-right">');
          var $username = $('<h5>').text($('.username').html());
          var $message = $('<p>').text(fileName);
          $chatItem.append($username, $message);
          $('#chat-messages').append($chatItem);
          $('#imFile').val('');
        }
        // callback function for failure sendImWithImageToGroup
        onsendImWithImageToGroupFailure = function (message) {
          console.log("onsendImWithImageToGroupFailure");
        }

        // Send Audio to Selected Group
        sendImWithAudioToGroup = function () {

          var selectedGrpObj = $("#group-names-send option:selected");
          var group_id = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          var file = document.getElementById("imFile").files[0];
          kandy.messaging.sendGroupImWithAudio(group_id, file, onsendImWithAudioToGroupSuccess, onsendImWithAudioToGroupFailure);
        }

        // callback function for Success sendImWithAudioToGroup
        onsendImWithAudioToGroupSuccess = function (message) {
          var fileName = "";
          var selectedGrpObj = $("#group-names-send option:selected").val();
          var groupName = $("#group-names-send option:selected").text();
          fileName = message.message.content_name;
          var $chatItem = $('<div class="well1 text-right">');
          var $username = $('<h5>').text($('.username').html());
          var $message = $('<p>').text(fileName);

          $chatItem.append($username, $message);
          $('#chat-messages').append($chatItem);
          $('#imFile').val('');
        }
        // callback function for failure sendImWithAudioToGroup
        onsendImWithAudioToGroupFailure = function (message) {

          console.log("onsendImWithAudioToGroupFailure");
        }

        // Send Video to Selected Group
        sendImWithVideoToGroup = function () {

          var selectedGrpObj = $("#group-names-send option:selected");
          var group_id = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          var file = document.getElementById("imFile").files[0];
          kandy.messaging.sendGroupImWithVideo(group_id, file, onsendImWithVideoToGroupSuccess, onsendImWithVideoToGroupFailure);
        }

        // callback function for Success sendImWithVideoToGroup
        onsendImWithVideoToGroupSuccess = function (message) {
          var fileName = "";
          var selectedGrpObj = $("#group-names-send option:selected").val();
          var groupName = $("#group-names-send option:selected").text();
          fileName = message.message.content_name;
          var $chatItem = $('<div class="well1 text-right">');
          var $username = $('<h5>').text($('.username').html());
          var $message = $('<p>').text(fileName);

          $chatItem.append($username, $message);
          $('#chat-messages').append($chatItem);
          $('#imFile').val('');
        }
        // callback function for failure sendImWithVideoToGroup
        onsendImWithVideoToGroupFailure = function (message) {

          console.log("onsendImWithVideoToGroupFailure");
        }

        // Leave Participants from the Group on clicking of "Leave Group" Button
        $("#leaveGroup").on("click", function () {
          var selectedGrpObj = $("#group-names-send option:selected");
          var groupId = selectedGrpObj.val();
          var groupName = selectedGrpObj.text();
          kandy.messaging.getGroupById(groupId,
            function (results) {
              var LoggedUser = $(".username").text();
              var groupOwnerArr = results.owners;
              var leaveGroupFlag = false;
              for (var i = 0; i < groupOwnerArr.length; i++) {
                var groupOwnerName = groupOwnerArr[i].full_user_id;
                groupOwnerName = groupOwnerName.split("@")[0];
                if (groupOwnerName == LoggedUser) {
                  leaveGroupFlag = true;
                }
              }
              if (leaveGroupFlag == true) {
                alert("Oops !! You seems to be a admin to this Group. Only Participants can able to leave from the Group");
              } else {
                kandy.messaging.leaveGroup(groupId, onLeaveGroupSuccess, onLeaveGroupFailure);
              }
            },
            function () {
              alert('Something went wrong when we did the search. Try again.');
            });


        });

        // Callback for onLeaveGroupSuccess
        onLeaveGroupSuccess = function (message) {
          console.log("onLeaveGroupSuccess");
        };

        // Callback for onLeaveGroupFailure
        onLeaveGroupFailure = function (message) {
          console.log("onLeaveGroupFailure");
        };

        UIState.initial = function() {
          console.log('initial');

          $audioRingIn[0].pause();
          $audioRingOut[0].pause();

          $('#call-form p, #incoming-call p, #call-connected p').text('');
          $('#incoming-call, #call-connected, .call-terminator, #resume-call-btn').addClass('hidden');
          $('#call-form, .call-initializer').removeClass('hidden')
        };

      });
    });
