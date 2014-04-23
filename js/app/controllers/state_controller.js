// Should I merge TransactionCtrl and StateCtrl ? What about the Single responsibility principle?
mozartApp.controller('StateCtrl', function($scope, $http, mrequest, JCappucinoService, DataService){
    $scope.state = "chargement";
    $scope.cart = DataService.cart;
      
    $scope.cardScanned = function(){
        console.log("A card has been scanned!");
        $scope.badge_id = JCappucinoService.mockCard();
        console.log($scope.cart);
        if($scope.cart == []){
            $scope.state = 'userPanel';
            // panel should display user info (solde) to fetch from server
            // $scope.solde = 
            // and allow cancelling last operations 
         }
        else {
            $scope.state = 'transactionTriggered';
            //Commit the transaction
        }
     }

     $scope.cancelTransaction = function(){
        //Cancel a given past transaction
     }

  //JCappucinoService.subscribe("pong", function(message) {
    //$scope.state = message;
    //console.log($scope.state);
    // if cart is empty, display the user info control (user credit, cancel operations etc)
    //else try and pay up the cart (TransactionCtrl)
    // use broadcast, emit , on etc to communicate between controllers
  });

//});