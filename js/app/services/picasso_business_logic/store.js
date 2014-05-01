// Store (contains the products) built for a specific fundation
//
function store() {
    this.products = {};
    this.show = [];
    this.cat_selected = -1;
    this.categories = {};
    this.first_cat = {};
    this.fun_id = null;
}

store.prototype.getProduct = function (id) {
    return this.products[id];
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
    this.products[id] = myProduct;
}

store.prototype.addCategory = function(cat) {
    this.categories[cat.id] = cat;
    if(cat.parent_id == null) {
        this.first_cat[cat.id] = cat;
        if(this.cat_selected == null) {
            this.cat_selected = cat.id;
        }
    }
}

store.prototype.getParent = function(catId) {
    if(this.categories[catId].parent_id) {
        return this.getParent(this.categories[catId].parent_id);
    } else {
        return catId;
    }
}

store.prototype.catClick = function(catId) {
    this.cat_selected = catId;  
    for (var i in this.products) {
        if(!this.products[i].super_parent) {
            this.products[i].super_parent = this.getParent(this.products[i].categorie_id);
        }
    }
}