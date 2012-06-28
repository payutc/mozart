var POSS = {};

POSS.isLoadedSeller = function(){
  var pl = new SOAPClientParameters();
  SOAPClient.invoke(soapurl.poss, "isLoadedSeller", pl, true, POSS.isLoadedSeller_result);
}

POSS.isLoadedSeller_result = function(r){
  if(r == 1){
    POSS.getSellerIdentity(1);
  }
  else {
    var params = jQuery.deparam.querystring();
    if(params.ticket){
      console.debug("Validation du ticket "+params.ticket);
      POSS.loadPOS(params.ticket);
    }
    else {
      // Envoi vers le CAS
      var pl = new SOAPClientParameters();
      SOAPClient.invoke(soapurl.poss, "getCasUrl", pl, true, POSS.casUrlReceived);
    }
  }
}

POSS.casUrlReceived = function(r){
  window.location = jQuery.param.querystring(r, 'service='+window.location.href.split("?")[0]); // TODO ajouter /login à l'url
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



POSS.transaction = function(badge){
    //"9421","arthur","puyou","/!\ pas BDE /!\ puyouart","","4200";
    
    var csvArticles = "";
    for(i=0;i<lignes.length;i++)
        csvArticles = csvArticles + lignes[i].article + ";";

    var pl = new SOAPClientParameters();
    pl.add("obj_ids", csvArticles);
    pl.add("badge_id", badge);

    SOAPClient.invoke(soapurl.poss, "transaction", pl, true, POSS.transaction_result);
}

POSS.transaction_result = function(r){
    //console.log("transaction result: "+r);
    // TODO traiter les erreurs !
    if(r == 1)
      $("#status").html("Paiement réussi !").effect("highlight", {color: "#00CC00"}, 1500, restore);
    else
      $("#status").html("Une erreur s'est produite.").effect("highlight", {color: "#FF0000"}, 1500, restore);
   
 
}