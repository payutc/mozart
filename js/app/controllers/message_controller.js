//Receive messages and broadcast them to children. Also manages error messages
//Mediator
mozartApp.controller('MsgCtrl',function($scope){
    
    $scope.$on("MSG_UPDATE_FUN",function(event,message){
        $scope.ready = true;
        $scope.$broadcast("UPDATE_FUN",message);    
    });

    $scope.$on("MSG_GET_ARTICLES",function(event,message){
        $scope.$broadcast("GET_ARTICLES",message);
    });

    //could we bypass the mediator for these actions?
    /* $scope.$on("MSG_COMMIT_TRANSACTION",function(event,message){
        $scope.$broadcast("COMMIT_TRANSACTION",message);
    });

    $scope.$on("MSG_D_USER_INFO",function(event,message){
        $scope.$broadcast("D_USER_INFO",message);
    });

    */


    //ERROR MESSAGES
    //Rights error : user get 0 fundations on getFundations POST request
    $scope.$on("ERROR_FUN_RIGHTS",function(event,message){
        console.log(message);  
    });

    //getArticles error : user gets 0 articles to sell for his fundation
    $scope.$on("ERROR_GET_ARTICLES",function(event,message){
        console.log(message);  
    });
});

