//Receive messages and broadcast them to children. Also manages error messages
//Mediator
mozartApp.controller('MsgCtrl',function($scope, $modal){
    
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

    // Certaines erreurs sont bloquantes, et nécessite une intervention en dehors de mozart
    // Dans ce cas la on affiche le message, ainsi qu'un bouton permettant la déconnexion 
    // + retour sur le cas.
    $scope.$on("CRITICAL_ERROR",function(event,message){
        $scope.critError = message;
        $scope.modalInstance = $modal.open({
            templateUrl: 'modalCritError.html',
            scope: $scope,
            keyboard: false
        });
    });

    //getArticles error : user gets 0 articles to sell for his fundation
    $scope.$on("ERROR_GET_ARTICLES",function(event,message){
        console.log(message);  
    });

    $scope.onLogoutClick = function(){
        $scope.$broadcast("LOGOUT","");
    };
});

