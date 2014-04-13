mozartApp.controller('ArticleCtrl',function($scope, $http, mrequest, localStorageService){

    $scope.$on("GET_ARTICLES",function(event,message){
        mrequest.do('POSS3','getArticles',{fun_id : message}).success(function(data){
            
            if(data == null) {
                $scope.$emit("ERROR_GET_ARTICLES","Aucun article à vendre!");
             }
             else{
                 //Constructing list of articles
                 console.log(data)
                 $scope.articles = data;
                 $scope.artClick = function(artId,artName,artPrice){
                    console.log("Vous avez selectionné " + artName + artId + artPrice);
                 }
             }
        });
    });
});
