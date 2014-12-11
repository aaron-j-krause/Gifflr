 var app = angular.module('cfapp', ['ngRoute', 'firebase']);

//Timeline and Event add and remove functions. Timeline master Object
app.service('UserService', function() {

});

app.controller('UserController', ['$scope', '$firebase', 'UserService', '$timeout', function($scope, $firebase, UserService, $timeout) {
  var usersRef = new Firebase('https://sizzling-heat-5879.firebaseio.com/cf/users');

  $scope.users = $firebase(usersRef).$asObject();
  $scope.editMode = '';
  $scope.updateMode = false;


  function checkList(){
    if($scope.users.length == 1 || !($scope.active in $scope.users)){
      $scope.active = $scope.users[0];
    }
  }

  $scope.users.$loaded().then(function(){
    //$scope.users.suckafish420 = {"screenname":"suckafish420","first":"blinky", "last":"fish", "email":"email"}
    //$scope.users.$save();
    $timeout(checkList, 100);
  });

  //adds new user
  $scope.add = function(screenname, first, last, email){
    $scope.users[screenname] = {"screenname": screenname, "first":first, "last":last, "email":email};
    $scope.users.$save();
    $scope.screenname = '';
    $scope.first = '';
    $scope.last = '';
    $scope.email = '';
  }
  //deletes user
  $scope.delete = function(user){
    delete $scope.users[user.screenname];
    $scope.users.$save();
  }

  //activates user
  $scope.activate = function(user){
    $scope.updateMode = false;
    if($scope.active == user){
      $scope.active = '';
    } else {
      $scope.active = user;

    }
  }

  //opens new user window
  $scope.newWindow = function(){
    if($scope.newwindow){
      $scope.newwindow = false;
    }
    else{
      $scope.newwindow = true;
    }

  }

  $scope.update = function(user, updates){
    for(i in updates){
      $scope.users[user.screenname][i] = updates[i];
      updates[i] = '';
    }
    $scope.users.$save();
    $scope.active = user;
  }
  $scope.isActive = function(user){
    return $scope.active == user;
  }



  //activates update mode
  $scope.setUpdateMode = function($event, user, updates){
    //console.log(updates);
    //console.log($scope.users)
    if($event.type == 'click'){
      $scope.updateMode = user;
    }
    else if($event.keyCode == 13){
      $scope.updateMode = false;
      $scope.update(user, updates);
    }
  }




  //activates edit mode
  $scope.setEditMode = function(user){
    if(!$scope.editMode){
      $scope.editMode = user;
    }
    else{
      $scope.editMode = '';
    }
  }

  $scope.isEditMode = function(user){
    return $scope.editMode == user;
  }

}]);



app.controller('GifController', ['$scope', '$firebase', 'UserService', function($scope, $firebase, UserService) {
    var gifsRef = new Firebase('https://sizzling-heat-5879.firebaseio.com/cf/gifs');
    $scope.gifList = $firebase(gifsRef).$asArray();

    $scope.addGif = function(gif){
      $scope.gifList.$add(gif)
      $scope.gif = '';
    }



}])


