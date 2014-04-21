mozartApp.controller('StateCtrl',function($scope, $http, mrequest, JCappucinoService, DataService){
  $scope.message = "Chargement...";
  $scope.cart = DataService.cart;
 
  JCappucinoService.subscribe("pong", function(message) {
    $scope.message = message;
    console.log($scope.message);
    // if cart is empty, display the user info control (user credit, cancel operations etc)
    //else try and pay up the cart (TransactionCtrl)
    // use broadcast, emit , on etc to communicate between controllers
  });

});