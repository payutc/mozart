mozartApp.controller('ArticleCtrl',function($scope, $http, mrequest, localStorageService, DataService){

    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    // Just in case, clearing the cart
    $scope.cart.clearItems();
    $scope.$on("GET_ARTICLES",function(event,message){
        mrequest.do('POSS3','getArticles', {fun_id : message}).success(function(data){

            if(data == null) {
                $scope.$emit("ERROR_GET_ARTICLES", "Aucun article à vendre!");
             }
             else{
                 //Constructing list of articles
                 $scope.articles = data;
                 // Add all items to the store
                 for (var i = $scope.articles.length - 1; i >= 0; i--) {
                    $scope.store.addProduct($scope.articles[i]['id'], $scope.articles[i]['name'], 
                        $scope.articles[i]['categorie_id'], $scope.articles[i]['fundation_id'],
                        $scope.articles[i]['price'], $scope.articles[i]['stock'],
                        $scope.articles[i]['alcool']);
                 };

                console.log($scope.cart.getTotalPrice(null))


                 $scope.artClick = function(artId){
                    // Get product from store
                    product = $scope.store.getProduct(artId)
                    // Add product to cart
                    $scope.cart.addItem(product['id'], product['name'], product['price'], 1)
                    // Debug
                    console.log($scope.cart.items)
                 }

                 $scope.resetCart = function(){
                    $scope.cart.clearItems();
                 }

                 $scope.cancelLastOperation = function(){
                    $scope.cart.cancelLastItem();
                 }
             }
        });
    });
});
