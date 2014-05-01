// I'll merge TransactionCtrl and StateCtrl ? What about the Single responsibility principle?
mozartApp.controller('StateCtrl', function($scope, $http, $modal, $timeout, mrequest, JCappucinoService, DataService, PrintFormatter){
    $scope.state = "Chargement...";
    $scope.state_bgcolor = "#f5f5f5";
    $scope.state_bordercolor = "#e3e3e3";
    $scope.cart = DataService.cart;
    $scope.store = DataService.store;
      
    resetColor = function(t) {
        setTimeout(function() {
            $scope.state = "Prêt...";
            $scope.state_bgcolor = "#f5f5f5";
            $scope.state_bordercolor = "#e3e3e3";
        }, t);
    }

    handleError = function(data) {
        if(data.error) {
            $scope.state = data.error.message;
        } else {
            $scope.state = "Erreur réseau !";
        }
        $scope.state_bgcolor = "#f50000";
        $scope.state_bordercolor = "#e30000";
        resetColor(4000);
    }

    JCappucinoService.subscribe("cardInserted", function(badge_id) {
        if($scope.cart.items.length == 0){
            $scope.state = 'Récupération des infos utilisateur...';
            $scope.badge_id = badge_id;
            // panel should display user info (solde) to fetch from server
            mrequest.do('POSS3', 'getBuyerInfo', { badge_id: badge_id } ).success( function(data){
                $scope.user = data;
                $scope.user.last_purchases.reverse();
                $scope.modalInstance = $modal.open({
                    templateUrl: 'modalUser.html',
                    scope: $scope,
                    keyboard: true
                });
                resetColor();
            }).error(function(data) {
                handleError(data);
            });
         }
        else {
            $scope.state = 'Transaction en cours...';
            mrequest.do('POSS3', 'transaction', { fun_id: $scope.store.fun_id, badge_id: badge_id, obj_ids: $scope.cart.formatPoss3() } ).success( function(data){
                var ticket = PrintFormatter.Ticket(data);
                JCappucinoService.send("print", ticket);
                $scope.state = 'Transaction réussi...';
                $scope.state_bgcolor = "#00f500";
                $scope.state_bordercolor = "#00e300";
                resetColor(2000);
            }).error(function(data) {
                handleError(data);
            });
        }
     });

    $scope.cancelTransaction = function(pur_id){
        var pur = null;
        for(var i = 0; i < $scope.user.last_purchases.length; i++) {
            if($scope.user.last_purchases[i].pur_id == pur_id) {
                pur = $scope.user.last_purchases[i];
                break;
            }
        }
        mrequest.do('POSS3', 'cancel', { fun_id: $scope.store.fun_id, pur_id: pur_id } ).success( function(data){
            $scope.user.solde = (1 * $scope.user.solde) + (1 * pur.pur_price);
            $scope.user.last_purchases.splice(i, 1);
        }).error(function(data) {
        });
    }

    JCappucinoService.subscribe("onopen", function(message) {
        resetColor(0);
    });

    JCappucinoService.subscribe("onerror", function(message) {
        $scope.state = "Erreur de communication avec la badgeuse et l'imprimante !";
        $scope.state_bgcolor = "#f50000";
        $scope.state_bordercolor = "#e30000";
        // retry connection in 2sec
        $timeout(JCappucinoService.connect, 2000);
    });

    JCappucinoService.subscribe("onclose", function(message) {
        $scope.state = "Erreur de communication avec la badgeuse et l'imprimante !";
        $scope.state_bgcolor = "#f50000";
        $scope.state_bordercolor = "#e30000";
        // retry connection in 2sec
        $timeout(JCappucinoService.connect, 2000);
    });

    // Check that connection with server always exist
    // If no go back to CAS.
    function poll(){
        mrequest.do('KEY', 'getStatus', {}).success(function(data){
            if(!data.user || !data.application) {
                $scope.$emit("CRITICAL_ERROR","La session a expiré !");
                return;
            }
            $timeout(poll, 30000);
        }).error(function(data) {
            handleError("");
            $timeout(poll, 4000);
        });
    };

    $scope.$on("UPDATE_FUN",function(event,message){
        poll();
    });
});