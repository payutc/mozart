mozartApp.controller('UserCtrl',function($scope, $http, $location, $window, $timeout, mrequest, localStorageService) {

            //If there is no ticket, redirection to CAS with $windows.location
            if(!$location.search().ticket){    
                $http.post(server_url + '/POSS3/getCasUrl').success(function(data) {
                    $window.location.href = angular.fromJson(data) + '/login?service=' + encodeURIComponent($location.absUrl());
                });
            }
            //Ticket validation and key application
            else {
                var ticket = $location.search().ticket ;
                $location.search('');
                mrequest.do('KEY', 'loginCas', {ticket: ticket, service: $location.absUrl()}).success(function(data){

                    mrequest.do('KEY', 'getStatus', {}).success(function(data){
                        $scope.username = data.user_data.firstname +' '+ data.user_data.lastname;
                        
                        if(data.application == null){
                            //No app key, we register one. appName to ask to user later
                            var keyValue = localStorageService.get('applicationKey');
                            if(keyValue == null){
                                var appName = "dummyName";
                                mrequest.do('KEY', 'registerApplication', { app_url: 'test', app_name : appName }).success(function(data){
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
               });
            }
    (function poll(){
        var currentdate = new Date(); 
        $scope.currentTime = currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();

        $timeout(poll, 1000);
    })();
});
