mozartApp.controller('UserCtrl',function($scope, $http, $location, $window, $timeout, $modal, mrequest, localStorageService) {
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
            // User is logged, logg app
            $scope.$emit("USER_LOGGED","");
        }).error(function(data) {
            // Error during cas ticket validation
            $scope.$emit("ERROR_LOGIN_CAS","L'authentification CAS a échoué.");
        });
    }

    // User is logged, 
    $scope.$on("USER_LOGGED", function(event, message) {
        // Get user info
        mrequest.do('KEY', 'getStatus', {}).success(function(data){
            $scope.username = data.user_data.firstname +' '+ data.user_data.lastname;
            // Request login app
            $scope.$emit("LOG_APP","");
        });
    });

    $scope.$on("LOG_APP", function(event, message) {
        var keyValue = localStorageService.get('applicationKey');
        if(keyValue == null){
            $scope.$emit("NEW_APP","");
        }
        else{
            mrequest.do('POSS3', 'loginApp', {key : localStorageService.get('applicationKey')}).success(function(data){
                $scope.$emit("MSG_UPDATE_FUN","getFundations");
            }).error(function(data) {
                $scope.$emit("ERROR_LOGIN_APP","L'authentification de l'app a échoué.");
            });
        }
    });

    $scope.$on("NEW_APP", function(event, message) {
        $scope.reset();
        $scope.modalInstance = $modal.open({
            templateUrl: 'modalNewApp.html',
            scope: $scope,
            keyboard: false
        });
    });

    $scope.reset = function() {
        $scope.app = {
            title: 'Mozart - '+(new Date()).toDateString(),
            desc: 'Déclaré par '+$scope.username
        };
    }

    $scope.declare = function(app) {
        mrequest.do('KEY', 'registerApplication', { app_url: $location.absUrl(), app_name: $scope.app.title, app_desc: $scope.app.desc }).success(function(data){
            localStorageService.add('applicationKey',data.app_key);
            $scope.modalInstance.close();
            $scope.$emit("LOG_APP","");                   
        });
    }

    $scope.$on("LOGOUT",function(event,message){
        mrequest.do('KEY', 'logout', {}).success(function(data){
            $http.post(server_url + '/POSS3/getCasUrl').success(function(data) {
                $window.location.href = angular.fromJson(data) + '/logout?url=' + encodeURIComponent($location.absUrl());
            });
        });
    });

    (function poll(){
        var currentdate = new Date();
        var H = currentdate.getHours()+"";
        var M = currentdate.getMinutes()+"";
        var S = currentdate.getSeconds()+"";
        if(H<10) H = "0"+H;
        if(M<10) M = "0"+M;
        if(S<10) S = "0"+S;
        $scope.currentTime = H + ":" + M + ":" + S;
        $timeout(poll, 1000);
    })();
});