var mozartApp =  angular.module('mozartApp', ['LocalStorageModule'], function($locationProvider) {
      $locationProvider.html5Mode(true);
    });

//Receive messages and broadcast them to children. Also manages error messages
mozartApp.controller('MsgCtrl',function($scope){
    
    $scope.$on("MSG_UPDATE_FUN",function(event,message){
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


mozartApp.service('mrequest', function($http){
    
    this.do = function(service, method, data){ 
        var str = [];
        for(var p in data)
            if (data.hasOwnProperty(p))
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));

        return $http({
        method: 'POST',
        url: server_url + service + '/' + method,
        data: str.join("&"),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

});	


mozartApp.controller('UserCtrl',function($scope, $http, $location, $window, mrequest, localStorageService) {


            //No ticket, redirection to CAS
            if(!$location.search().ticket){    
                $http.post(server_url + '/POSS3/getCasUrl').success(function(data) {
                    $window.location.href = angular.fromJson(data) + '/login?service=' + encodeURIComponent($location.absUrl());
                });
            }
            //Ticket validation and key application
            else {
                
                var ticket = $location.search().ticket ;
                $location.search('');
                mrequest.do('POSS3', 'loginCas', {ticket: ticket, service: $location.absUrl()}).success(function(data){});

                mrequest.do('POSS3', 'getStatus', {}).success(function(data){
                    $scope.username = data.user_data.firstname +' '+ data.user_data.lastname;
                    
                    if(data.application == null){
                        //No app key, we register one. appName to ask to user later
                        var keyValue = localStorageService.get('applicationKey');
                        if(keyValue == null){
                            var appName = "dummyName";
                            mrequest.do('KEY', 'registerApplication', {app_url: $location.absUrl(), app_name : appName}).success(function(data){
                                localStorageService.add('applicationKey',data.app_key);
                                mrequest.do('POSS3', 'loginApp', {key : localStorageService.get('applicationKey')}).success(function(data){
                                });
                                                     
                            });
                        }
                        else{
                            mrequest.do('POSS3', 'loginApp', {key : localStorageService.get('applicationKey')}).success(function(data){
                            });
                        }
                    }
                    else{
                        //we have app data, propagate event to fundation controller
                        $scope.$emit("MSG_UPDATE_FUN","getFundations");
                    }
                    });

            
            }


         }

);

mozartApp.controller('FunCtrl',function($scope, $http, mrequest){
    
    $scope.$on("UPDATE_FUN",function(event,message){
         mrequest.do('POSS3',message).success(function(data){

             //pas de fundation
             if(data == null) {
                $scope.$emit("ERROR_FUN_RIGHTS","Aucune fundation trouvée. Vous n'avez pas de droits pour cette application");
             }
             else{
                 //Constructing  HTML list of fundation
                 $scope.fundations = data;
                 $scope.funChoice = function(funId){
                    //to make into parent's scope?
                    $scope.funId = funId;
                    $scope.fundations = null;
                    $scope.$emit("MSG_GET_ARTICLES",$scope.funId);
                 }
             }
       
         });
        
    });
    
});


mozartApp.controller('ArticleCtrl',function($scope, $http, mrequest, localStorageService){

    $scope.$on("GET_ARTICLES",function(event,message){
        mrequest.do('POSS3','getArticles',{fun_id : message}).success(function(data){
            
            if(data == null) {
                $scope.$emit("ERROR_GET_ARTICLES","Aucun article à vendre!");
             }
             else{
                 //Constructing list of articles
                 $scope.articles = data;
                 $scope.artClick = function(artId,artName,artPrice){
                    console.log("Vous avez selectionné " + artName + artId + artPrice);
                 }
             }
        });
    });


});


/*
mozartApp.controller('TransactionCtrl',function($scope, $http, mrequest){
}; 

mozartApp.controller('StateCtrl',function($scope, $http, mrequest){
};

*/
    
    
    
