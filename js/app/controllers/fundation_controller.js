mozartApp.controller('FunCtrl', function($scope, $http, mrequest){

    $scope.$on("UPDATE_FUN",function(event,message){
         mrequest.do('POSS3',"getFundations").success(function(data){
             //No fundation
             if(data == null) {
                $scope.$emit("ERROR_FUN_RIGHTS","Aucune fundation trouvée. Vous n'avez pas de droits pour cette application");
             }
             else{
                 //Constructing  HTML list of fundation
                 $scope.fundations = data;
                 $scope.funChoice = function(funId){
                    $scope.funId = funId;
                    $scope.fundations = null;
                    $scope.$emit("MSG_GET_ARTICLES",$scope.funId);
                 }
             }
         });
    });
});
