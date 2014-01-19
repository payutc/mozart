var mozartApp =  angular.module('mozartApp', [], function($locationProvider) {
      $locationProvider.html5Mode(true);
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


mozartApp.controller('UserCtrl',function($scope, $http, $location, $window, mrequest){

    //pas de ticket, redirection vers le CAS
    if(!$location.search().ticket){    
        $http.post(server_url + '/POSS3/getCasUrl').success(function(data) {
            $window.location.href = angular.fromJson(data) + '/login?service=' + encodeURIComponent($location.absUrl());
        });
    }
    //validation du ticket
    else{
        var ticket = $location.search().ticket ;
        $location.search('');
        mrequest.do('POSS3', 'loginCas', {ticket: ticket, service: $location.absUrl()}).success(function(data){
            });

        mrequest.do('POSS3', 'getStatus', {}).success(function(data){
            $scope.username = data.user_data.firstname +' '+ data.user_data.lastname;

        });

        
        }

    
});
    
    
