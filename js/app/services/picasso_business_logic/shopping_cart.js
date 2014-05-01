// shopping cart
//
function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.items = [];
    this.history = [];
}

// adds an item to the cart
shoppingCart.prototype.addItem = function (id, name, price, quantity) {
    quantity = this.toNumber(quantity);
    if (quantity != 0) {

        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.id == id) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var item = new cartItem(id, name, price, quantity);
            this.items.push(item);
        }

        this.history.push(id);
    }
}

// Reduce quantity of last item by 1. If quantity = 0 remove item from the cart
shoppingCart.prototype.cancelLastItem = function() {
    if(this.history.length == 0) {
        return;
    }
    var last_item_id = this.history.pop();
    for(var i=0; i<this.items.length; i++) {
        var last_item = this.items[i];
        if(last_item.id == last_item_id) {
            break;
        }
    }
    last_item.quantity = this.toNumber(last_item.quantity - 1);
    if (last_item.quantity <= 0) {
        this.items.splice(i, 1);
    }
}

//var last_element = my_array[my_array.length - 1];

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (id) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (id == null || item.id == id) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (id) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (id == null || item.id == id) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

// clear the cart
shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.history = [];
}

shoppingCart.prototype.formatPoss3 = function () {
    var d = [];
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        d.push([item.id, item.quantity]);
    }
    this.clearItems();
    return JSON.stringify(d);
}

shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// items in the cart
//
function cartItem(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
}
