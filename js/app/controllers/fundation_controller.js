mozartApp.controller('FunCtrl', function($scope, $http, $modal, mrequest){
    $scope.$on("UPDATE_FUN",function(event,message){
         mrequest.do('POSS3',"getFundations").success(function(data){
             //No fundation
             if(data == null) {
                $scope.$emit("ERROR_FUN_RIGHTS","Aucune fundation trouvée. Vous n'avez pas de droits pour cette application");
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

                    var modalInstance = $modal.open({
                      templateUrl: 'modalFunCtrl.html',
                      controller: ModalFunCtrl,
                      scope: $scope,
                      keyboard: false
                    });
                }
             }
         });
    });
});

var ModalFunCtrl = function ($scope, $modalInstance) {
  $scope.funChoice = function(funId){
    $scope.$emit("MSG_GET_ARTICLES", funId);
    $modalInstance.close();
  }
};
