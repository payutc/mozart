mozartApp.controller('StateCtrl',function($scope, $http, mrequest, JCappucinoService, DataService){
  $scope.message = "Chargement...";
 
  JCappucinoService.subscribe("pong", function(message) {
    $scope.message = message;
  });

  



});