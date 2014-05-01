mozartApp.controller('FunCtrl', function($scope, $http, $modal, mrequest){
    $scope.$on("UPDATE_FUN",function(event,message){
        mrequest.do('POSS3',"getFundations").success(function(data){
            //No fundation
            if(data == null) {
                $scope.$emit("CRITICAL_ERROR","Aucune fundation trouvée. Vous et/ou cette application n'avez pas de droits de vente.");
            }
            else{
                if(data.length == 1) {
                    // Only one fundation, select it
                    $scope.$emit("MSG_GET_ARTICLES",data[0].fun_id);
                } else {
                    if(data[0].fun_id == null) {
                        data.shift();
                    }
                    $scope.fundations = data;

                    $scope.modalInstance = $modal.open({
                        templateUrl: 'modalFunCtrl.html',
                        scope: $scope,
                        keyboard: false,
                        backdrop: 'static'
                    });
                }
            }
        }).error(function(data) {
            $scope.$emit("CRITICAL_ERROR","Aucune fundation trouvée. Vous et/ou cette application n'avez pas de droits de vente.");
        });
    });

    $scope.funChoice = function(funId){
        $scope.$emit("MSG_GET_ARTICLES", funId);
        $scope.modalInstance.close();
    }
});
