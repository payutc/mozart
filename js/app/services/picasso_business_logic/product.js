//----------------------------------------------------------------
// Product class to build them when receiving JSON description from server
function product(id, name, categorie_id, fundation_id, price, stock, alcool, image) {
    this.id = id;
    this.name = name;
    this.categorie_id = categorie_id;
    this.price = price;
    this.fundation_id = fundation_id;
    this.stock = stock;
    this.alcool = alcool;
    this.image = image;

}
