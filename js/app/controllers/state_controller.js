// I'll merge TransactionCtrl and StateCtrl ? What about the Single responsibility principle?
mozartApp.controller('StateCtrl', function($scope, $http, mrequest, JCappucinoService, DataService){
    $scope.state = "chargement";
    $scope.cart = DataService.cart;
    $scope.dev_mode = DEV_MODE;
      
    $scope.cardScanned = function(){
        console.log("A card has been scanned!");
        $scope.badge_id = JCappucinoService.mockCard();
        console.log("badge id is " + $scope.badge_id)
        console.log($scope.cart.items);
        if($scope.cart.items.length == 0){
            $scope.state = 'userPanel';
            // panel should display user info (solde) to fetch from server
            mrequest.do('POSS3', 'getBuyerInfo', { badge_id: $scope.badge_id } ).success( function(data){
              console.log("user info");
              console.log(data);
            });
            // $scope.solde = 
            // and allow cancelling last operations 
         }
        else {
            $scope.state = 'transaction';
            //Commit the transaction
        }
     }

     $scope.cancelTransaction = function(){
        //Cancel a given past transaction
     }

  // When JCappucino is ready integrate code here
  //JCappucinoService.subscribe("pong", function(message) {
    //$scope.state = message;
    //console.log($scope.state);
    // if cart is empty, display the user info control (user credit, cancel operations etc)
    //else try and pay up the cart (TransactionCtrl)
    // use broadcast, emit , on etc to communicate between controllers
  });

//});