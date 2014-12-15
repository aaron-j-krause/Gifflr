 var app = angular.module('cfapp', ['ngRoute', 'firebase']);

app.controller('UserController', ['$scope', '$firebase', function($scope, $firebase) {
  var usersRef = new Firebase('https://sizzling-heat-5879.firebaseio.com/cf/users');
  var gifsRef = new Firebase('https://sizzling-heat-5879.firebaseio.com/cf/gifs');

  $scope.gifList = $firebase(gifsRef).$asArray();
  $scope.users = $firebase(usersRef).$asObject();

  $scope.editMode = '';
  $scope.updateMode = false;

  //adds new user
  $scope.add = function(screenname, first, last, email) {
    if ($scope.newuser.$valid && !($scope.inusers(screenname))) {
      $scope.users[screenname] = {"screenname": screenname, "first":first, "last":last, "email":email};
      $scope.users.$save();
      $scope.screenname = '';
      $scope.first = '';
      $scope.last = '';
      $scope.email = '';
      $scope.newuser.submitted = false;
    } else {
      $scope.newuser.submitted = true;
    }
  };
  //deletes user
  $scope.delete = function(user) {
    if (confirm('Delete this user?')) {
      delete $scope.users[user.screenname];
      $scope.users.$save();
    }
  };

  //activates user
  $scope.activate = function(user) {
    $scope.updateMode = false;
    if ($scope.active == user) {
      $scope.active = '';
    } else {
      $scope.active = user;
    }
  };

  //opens new user window
  $scope.newWindow = function() {
    if ($scope.newwindow) {
      $scope.newwindow = false;
    }
    else {
      $scope.newwindow = true;
    }

  };

  //updates user info
  $scope.update = function(user, updates) {
    for (var i in updates) {
      if (updates[i]) {
        $scope.users[user.screenname][i] = updates[i];
        updates[i] = '';
      }
    }
    $scope.users.$save();
    $scope.active = user;
  };

  //expression that checks active state of given user
  $scope.isActive = function(user) {
    return $scope.active == user;
  };



  //activates update mode
  $scope.setUpdateMode = function($event, user, updates) {
    //console.log(updates);
    //console.log($scope.users)
    if ($event.type == 'click') {
      $scope.updateMode = user;
    }
    else if ($event.keyCode == 13) {
      $scope.updateMode = false;
      $scope.update(user, updates);
    }
  };

  //activates edit mode
  $scope.setEditMode = function(user) {
    if (!$scope.editMode) {
      $scope.editMode = user;
    }
    else {
      $scope.editMode = '';
    }
  };
  //checks if edit mode is active
  $scope.isEditMode = function(user) {
    return $scope.editMode == user;
  };
  //adds new gif to main body
  $scope.addGif = function(gif) {
    if (gif && $scope.isGif(gif)) {
      console.log(new Date());
      $scope.gifList.$add({"source":gif, "postedBy":$scope.active.screenname, "postedOn": (new Date()).toDateString()});
      $scope.source = '';
      $scope.addgif.submitted = false;
    }
    else {
      $scope.addgif.submitted = true;
      $scope.source = '';
    }
  };
  //verifies file is a gif
  $scope.isGif = function(file) {
    return file.slice(file.lastIndexOf('.'),file.length).toLowerCase() == '.gif';
  };
  //clears all gifs
  $scope.clear = function() {
    gifsRef.remove();
  };
  $scope.inusers = function(screenname) {
    return (screenname in $scope.users);
  };

}]);
