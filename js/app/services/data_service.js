// Create an angularJS data service that provides a store and a shopping cart that
// will be shared by all views

//var localData = angular.module('LocalData', []);

mozartApp.factory("DataService", function () {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("MozartStore");

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});
