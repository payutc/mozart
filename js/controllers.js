var mozartApp =  angular.module('mozartApp', [], function($locationProvider) {
      $locationProvider.html5Mode(true);
    });


mozartApp.controller('UserCtrl',function($scope, $http, $location, $window){
    
    //pas de ticket, redirection vers le CAS
    if(!$location.search().ticket){    
        $scope.service = $location.absUrl(); 
        $http.post(server_url + '/POSS3/getCasUrl').success(function(data) {
            $window.location.href = angular.fromJson(data) + '/login?service=' + encodeURIComponent($scope.service);
        });
    }
    //validation du ticket
    else{
    console.log(($location.search()).ticket);

    }

});
    
    
