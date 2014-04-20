mozartApp.controller('StateCtrl',function($scope, $http, mrequest, CardReaderService){
  $scope.message = "Chargement...";
 
  CardReaderService.subscribe("pong", function(message) {
    $scope.message = message;
  });
});