// Store (contains the products) built for a specific fundation
//
function store() {
    this.products = [
    ];
}

store.prototype.getProduct = function (id) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].id == id)
            return this.products[i];
    }
    return null;
}

store.prototype.getProductByName = function (name) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].name == name)
            return this.products[i];
    }
    return null;
}

store.prototype.addProduct = function(id, name, categorie_id, fundation_id, price, stock, alcool, image) {
    var myProduct = new product(id, name, categorie_id, fundation_id, price, stock, alcool, image);
    this.products.push(myProduct);
}
