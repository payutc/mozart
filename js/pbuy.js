var PBUY = {};

PBUY.loadSeller = function(){
	var pl = new SOAPClientParameters();
	pl.add("data", "trecouvr");
	pl.add("meanOfLogin", 1);
	pl.add("ip", "");
	pl.add("poi_id", 2);
	SOAPClient.invoke(soapurl.pbuy, "loadSeller", pl, true, PBUY.getSellerIdentity);
}
PBUY.getSellerIdentity = function(r){
    var result = CSVToArray(r);
    if(r == 1){
        var pl = new SOAPClientParameters();
    	SOAPClient.invoke(soapurl.pbuy, "getSellerIdentity", pl, true, PBUY.getProposition);
    }
    else
        console.log("Erreur de loadSeller: "+r);
}
PBUY.getProposition = function(r){
    var result = CSVToArray(r);
    $("#seller").html(result[0][1]+" "+result[0][2]);
    
    var pl = new SOAPClientParameters();
	SOAPClient.invoke(soapurl.pbuy, "getProposition", pl, true, PBUY.getProposition_callBack);
}
PBUY.getProposition_callBack = function(r){
    var result = CSVToArray(r);

    // On vide la liste d'articles
    articles = {};
    categories = [
        {
            nom: 'Tout',
            articles: []
        },
        {
            nom: 'Rien',
            articles: []
        },
        {
            nom: 'Le reste',
            articles: []
        }
    ];
    
    for(i=0;i<result.length;i++){
        if(result[i].length == 5){
            var article = {
                nom: result[i][1],
                couleur: '',
                prix: result[i][4]/100
            };
            articles[result[i][0]] = article;
            categories[0].articles.push(result[i][0]);
        }
    }
    updateCategories();
    showButtons(0);
}




PBUY.loadBuyer = function(data, mol){
	var pl = new SOAPClientParameters();
	pl.add("data", data);
	pl.add("meanOfLogin", mol);
	pl.add("ip", "");
	SOAPClient.invoke(soapurl.pbuy, "loadBuyer", pl, true, PBUY.getBuyerIdentity);
}
PBUY.getBuyerIdentity = function(r){
    if(r == 1){
        var pl = new SOAPClientParameters();
    	SOAPClient.invoke(soapurl.pbuy, "getBuyerIdentity", pl, true, PBUY.buyObjects);
    } else {
        console.log("Erreur de loadBuyer: "+r);
    }
}
PBUY.buyObjects = function(r){
    var result = CSVToArray(r);
    //"9421","arthur","puyou","/!\ pas BDE /!\ puyouart","","4200";
    $("#status").append(" "+result[0][1]+" "+result[0][2]);
    
    var csvArticles = "";
    var csvPrix = "";
    for(i=0;i<lignes.length;i++){
        csvArticles = csvArticles + lignes[i].article + ";";
        csvPrix = csvPrix + articles[lignes[i].article].prix * 100 + ";";
    }
    var pl = new SOAPClientParameters();
    pl.add("obj_id", csvArticles);
    pl.add("credit", csvPrix);
    SOAPClient.invoke(soapurl.pbuy, "buyObjects", pl, true, PBUY.buyObjects_callBack);
}
PBUY.buyObjects_callBack = function(r){
    console.log("buyObjects result: "+r);
    $("#status").append(" Paiement réussi");
   
    window.setTimeout(function(){
        lignes.length = 0;
        updateLignes();
        $("#status").html("").hide();
    }, 1000);
}