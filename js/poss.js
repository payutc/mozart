var POSS = {};

POSS.isLoadedSeller = function(){
  var pl = new SOAPClientParameters();
  SOAPClient.invoke(soapurl.poss, "isLoadedSeller", pl, true, POSS.isLoadedSeller_result);
}

POSS.isLoadedSeller_result = function(r){
  if(r == "true"){
    var m = new Object;
    m.success = "ok";
    POSS.getSellerIdentity(m);
  }
  else {
    var params = jQuery.deparam.querystring();
    if(params.ticket){
      console.debug("Validation du ticket "+params.ticket);
      POSS.loadPOS(params.ticket);
    }
    else {console.log("getcas");
      // Envoi vers le CAS
      var pl = new SOAPClientParameters();
      SOAPClient.invoke(soapurl.poss, "getCasUrl", pl, true, POSS.casUrlReceived);
    }
  }
}

POSS.casUrlReceived = function(r){
  if(r.success){
    var service = [location.protocol, '//', location.host, location.pathname].join('');
    var url = jQuery.param.querystring(r.success+'login', 'service='+service); // TODO ajouter /login à l'url
    window.location = url; 
  }
}

POSS.loadPOS = function(ticket, pos){
  var pl = new SOAPClientParameters();
  pl.add("ticket", ticket);
  pl.add("service", window.location.href.split("?")[0]);
  pl.add("poi_id", 2); // FIXME Option pour l'ID de POS
  SOAPClient.invoke(soapurl.poss, "loadPos", pl, true, POSS.getSellerIdentity);
}

POSS.getSellerIdentity = function(r){
  if(r.success){
    var pl = new SOAPClientParameters();
    SOAPClient.invoke(soapurl.poss, "getSellerIdentity", pl, true, POSS.getArticless);
  }
  else {
    console.log("Erreur de loadPos.");
    $("#status").html("Erreur n°"+r.error+"<br />"+r.error_msg).addClass("error");
    
    if(r.error == -1){
      $("#status").append('<br /><a href="#" id="retrycas">Cliquez ici pour retenter le login</a>');
      $("#retrycas").click(function(e){
        e.preventDefault();
        var service = [location.protocol, '//', location.host, location.pathname].join('');
        window.location = service;
      })
    }
    // TODO gérer correctement toutes les erreurs possibles
    // Si -1, souci avec le cas
    // Si code d'erreur, problème de droit
    // Message : Erreur n°XXX - DESCRIPTION + Lien pour recommencer + lien déconnexion du CAS
  }
}

POSS.getArticless = function(r){
  console.log(r);
  if(r.success){
    $("#seller").html(r.success.firstname+" "+r.success.lastname);

    var pl = new SOAPClientParameters();
    SOAPClient.invoke(soapurl.poss, "getArticles", pl, true, POSS.getPropositions_callBack); 
  }
}

POSS.getArticles = function(r){
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