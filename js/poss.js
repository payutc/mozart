var POSS = {};

POSS.sellerLogin = function(){
  var pl = new SOAPClientParameters();
  SOAPClient.invoke(soapurl.poss, "getCasUrl", pl, true, POSS.casUrlReceived);
}

POSS.casUrlReceived = function(r){
  window.location = jQuery.param.querystring(r, 'service='+window.location.href.split("?")[0]);
}

POSS.loadPOS = function(ticket, pos){
  var pl = new SOAPClientParameters();
  pl.add("ticket", ticket);
  pl.add("service", window.location.href.split("?")[0]);
  pl.add("poi_id", 2);
  SOAPClient.invoke(soapurl.poss, "loadPos", pl, true, POSS.getSellerIdentity);
}

POSS.getSellerIdentity = function(r){
  if(r == 1){
    var pl = new SOAPClientParameters();
    SOAPClient.invoke(soapurl.poss, "getSellerIdentity", pl, true, POSS.getPropositions);
  }
  else {
    console.log("Erreur de loadPos: "+r);
    // TODO gérer correctement toutes les erreurs possibles
    // Si -1, souci avec le cas
    // Si code d'erreur, problème de droit
    // Message : Erreur n°XXX - DESCRIPTION + Lien pour recommencer + lien déconnexion du CAS
  }
}

POSS.getPropositions = function(r){
  var result = CSVToArray(r);
  $("#seller").html(result[0][1]+" "+result[0][2]);
    
  var pl = new SOAPClientParameters();
  SOAPClient.invoke(soapurl.poss, "getPropositions", pl, true, POSS.getPropositions_callBack);
}

POSS.getPropositions_callBack = function(r){
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




POSS.loadBuyer = function(data, mol){
  return;
  var pl = new SOAPClientParameters();
	pl.add("data", data);
	pl.add("meanOfLogin", mol);
	pl.add("ip", "");
	SOAPClient.invoke(soapurl.pbuy, "loadBuyer", pl, true, POSS.getBuyerIdentity);
}
POSS.getBuyerIdentity = function(r){
    if(r == 1){
        var pl = new SOAPClientParameters();
    	SOAPClient.invoke(soapurl.pbuy, "getBuyerIdentity", pl, true, POSS.buyObjects);
    } else {
        console.log("Erreur de loadBuyer: "+r);
    }
}
POSS.buyObjects = function(r){
    var result = CSVToArray(r);
    //"9421","arthur","puyou","/!\ pas BDE /!\ puyouart","","4200";
    $("#status").append("<h2>"+result[0][1]+" "+result[0][2]+"</h2>");
    
    var csvArticles = "";
    var csvPrix = "";
    for(i=0;i<lignes.length;i++){
        csvArticles = csvArticles + lignes[i].article + ";";
        csvPrix = csvPrix + articles[lignes[i].article].prix * 100 + ";";
    }
    var pl = new SOAPClientParameters();
    pl.add("obj_id", csvArticles);
    pl.add("credit", csvPrix);
    SOAPClient.invoke(soapurl.pbuy, "buyObjects", pl, true, POSS.buyObjects_callBack);
}
POSS.buyObjects_callBack = function(r){
    console.log("buyObjects result: "+r);
    $("#status").append("<br />Paiement réussi");
   
    window.setTimeout(function(){
        lignes.length = 0;
        updateLignes();
        $("#status").html("").hide();
    }, 1000);
}