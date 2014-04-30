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
                // Add all items to the store
                for (var i = data.length - 1; i >= 0; i--) {
                    $scope.store.addProduct(data[i]['id'], data[i]['name'], 
                        data[i]['categorie_id'], data[i]['fundation_id'],
                        data[i]['price'], data[i]['stock'],
                        data[i]['alcool'], data[i]['image']);
                };
             }
        });

        mrequest.do('POSS3','getCategories', {fun_id : [message]}).success(function(data){
            for(var i=0; i<data.length; i++) {
                $scope.store.addCategory(data[i]);
            }
            $scope.store.catClick(data[0].id);
        });
    });


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
});