mozartApp.controller('ArticleCtrl',function($scope, $http, mrequest, localStorageService, DataService){

    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    $scope.$on("GET_ARTICLES",function(event,message){
        mrequest.do('POSS3','getArticles',{fun_id : message}).success(function(data){

            if(data == null) {
                $scope.$emit("ERROR_GET_ARTICLES","Aucun article à vendre!");
             }
             else{
                 //Constructing list of articles
                    // Add all items to the store
                 $scope.articles = data;
                 for (var i = $scope.articles.length - 1; i >= 0; i--) {
                    $scope.store.addProduct($scope.articles[i]['id'], $scope.articles[i]['name'], 
                        $scope.articles[i]['categorie_id'], $scope.articles[i]['fundation_id'],
                        $scope.articles[i]['price'], $scope.articles[i]['stock'],
                        $scope.articles[i]['alcool']);
                 };

                 $scope.artClick = function(artId,artName,artPrice){
                    console.log("Vous avez selectionné " + artName + artId + artPrice);
                 }
             }
        });
    });
});
