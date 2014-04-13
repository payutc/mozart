//Receive messages and broadcast them to children. Also manages error messages
mozartApp.controller('MsgCtrl',function($scope){
    
    $scope.$on("MSG_UPDATE_FUN",function(event,message){
        $scope.ready = true;
        $scope.$broadcast("UPDATE_FUN",message);    
    });

    $scope.$on("MSG_GET_ARTICLES",function(event,message){
        $scope.$broadcast("GET_ARTICLES",message);
    });

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