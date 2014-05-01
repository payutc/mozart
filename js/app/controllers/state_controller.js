// I'll merge TransactionCtrl and StateCtrl ? What about the Single responsibility principle?
mozartApp.controller('StateCtrl', function($scope, $http, $modal, mrequest, JCappucinoService, DataService){
    $scope.state = "Chargement...";
    $scope.state_bgcolor = "#f5f5f5";
    $scope.state_bordercolor = "#e3e3e3";
    $scope.cart = DataService.cart;
    $scope.store = DataService.store;
      
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
            }).error(function(data) {
                $scope.state = data.error.message;
                $scope.state_bgcolor = "#f50000";
                $scope.state_bordercolor = "#e30000";
                $scope.resetColor(4000);
            });
         }
        else {
            $scope.state = 'Transaction en cours...';
            mrequest.do('POSS3', 'transaction', { fun_id: $scope.store.fun_id, badge_id: badge_id, obj_ids: $scope.cart.formatPoss3() } ).success( function(data){
                $scope.state = 'Transaction réussi...';
                $scope.state_bgcolor = "#00f500";
                $scope.state_bordercolor = "#00e300";
                $scope.resetColor(2000);
            }).error(function(data) {
                $scope.state = data.error.message;
                $scope.state_bgcolor = "#f50000";
                $scope.state_bordercolor = "#e30000";
                $scope.resetColor(4000);
            });
        }
     });

    $scope.resetColor = function(t) {
        setTimeout(function() {
            $scope.state = "Prêt...";
            $scope.state_bgcolor = "#f5f5f5";
            $scope.state_bordercolor = "#e3e3e3";
        }, t);
    }

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
        $scope.state = "Prêt...";
    });

    JCappucinoService.subscribe("onerror", function(message) {
        $scope.state = "Erreur de communication...";
        $scope.state_bgcolor = "#f50000";
        $scope.state_bordercolor = "#e30000";
        $scope.resetColor(4000);
    });
});

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};