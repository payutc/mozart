var mozartApp =  angular.module('mozartApp', ['LocalStorageModule'], function($locationProvider) {
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
                                    console.log(data);
                                });
                                                     
                            });
                        }
                        else{
                            mrequest.do('POSS3', 'loginApp', {key : localStorageService.get('applicationKey')}).success(function(data){
                                console.log(data);
                            });
                        }
                    }
                    else{
                    console.log("pouet");

                    }
                    });

        
                
            }


         }

);
    
    
