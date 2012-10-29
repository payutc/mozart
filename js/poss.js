var POSS = {};

POSS.service = [location.protocol, '//', location.host, location.pathname].join('');

POSS.isLoadedSeller = function(){
  doRequest("isLoadedSeller", {}, POSS.isLoadedSeller_result);
}

POSS.isLoadedSeller_result = function(r){
  if(r == true){
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
    else {
      // Envoi vers le CAS
      var service = [location.protocol, '//', location.host, location.pathname].join('');
      var url = jQuery.param.querystring(casUrl+'login', 'service='+service);
      window.location = url;
    }
  }
}

POSS.casUrlReceived = function(r){
  if(r.success){
    // Sauvegarde de l'url
    casUrl = r.success;
    
    // La suite : connexion du vendeur
    POSS.isLoadedSeller();
  }
}

POSS.loadPOS = function(ticket, pos){
  doRequest("loadPos", {
    ticket: ticket,
    service: POSS.service,
    poi_id: 51}, // FIXME Option pour l'ID de POS
  POSS.getSellerIdentity);
}

POSS.getSellerIdentity = function(r){
  if(r.success){
    doRequest("getSellerIdentity", {}, POSS.getArticless);
    // Deconnexion du cas pour eviter qu'un permanencier puisse virer de l'argent de l'astreinteur
    $("#casimg").attr("src", "https://cas.utc.fr/cas/logout");
  }
  else {
    $("#status").html("Erreur n°"+r.error+"<br />"+r.error_msg).addClass("error");
    
    if(r.error == -1){
      $("#status").append('<br /><a href="#" id="retrycas">Cliquez ici pour retenter le login</a>');
      $("#retrycas").click(function(e){
        e.preventDefault();
        window.location = POSS.service;
      })
    }
    // TODO gérer correctement toutes les erreurs possibles
    // Si -1, souci avec le cas
    // Si code d'erreur, problème de droit
    // Message : Erreur n°XXX - DESCRIPTION + Lien pour recommencer + lien déconnexion du CAS
  }
}

POSS.logout = function(){
  var service = [location.protocol, '//', location.host, location.pathname].join('');
  doRequest("logout", {}, function(r){ 
      var url = jQuery.param.querystring(casUrl+'logout', 'service='+service);
      window.location = url;
  });
}

POSS.getArticless = function(r){
  if(r.success){
    $("#seller").html(r.success.firstname+" "+r.success.lastname);

    doRequest("getArticles", {}, POSS.getArticless_result);
  }
}

POSS.getArticless_result = function(r){
    // On vide la liste d'articles
    articles = {};
    categories = {};
    
    // Génération des catégories de niveau 0
    for(var key in r.success.categories){
      var categorie = r.success.categories[key];
      if(categorie.parent_id == null){
        var newCategorie = {
          nom: categorie.name,
          articles: []
        };
        categories[categorie.id] = newCategorie;
      }
    }
    
    // Remplissage des catégories avec les articles
    for(var key in r.success.articles){
      var article = r.success.articles[key];
      
      var newArticle = {
            nom: article.name,
            couleur: '',
            prix: article.price/100
      };
      articles[article.id] = newArticle;
      var parent = r.success.categories[article.categorie_id];

      while(parent.parent_id != null){
        parent = r.success.categories[parent.parent_id];
      }
      
      categories[parent.id].articles.push(article.id);
    }
    
    updateCategories();
    showButtons(-1);
}



POSS.transaction = function(badge){
    if(!transactionInProgress){
        transactionInProgress = true;
        var csvArticles = "";
        for(var i=0;i<lignes.length;i++){
          for(var j=0;j<lignes[i].quantite;j++)
            csvArticles = csvArticles + lignes[i].article + " "; 
        }

        doRequest("transaction", {
            badge_id: badge,
            obj_ids: csvArticles},
          POSS.transaction_result); 
    }
}

POSS.transaction_result = function(r){
  transactionEnCours = false;
    if(r.success) {
      // PRINT TICKET
      PRINTER.Ticket(lignes, r.success);
      $("#status").html("Paiement réussi !").effect("highlight", {color: "#00CC00"}, 1000, waitBadge);
      restore();
    }
    else {
      if(r.error){
        console.log(r.error_msg);
        $("#status").html("Erreur n°"+r.error+"<br />"+r.error_msg).effect("highlight", {color: "#FF0000"}, 3000, waitBadge);
      }
      else {
        $("#status").html("Erreur réseau, veuillez réessayer.").effect("highlight", {color: "#FF0000"}, 3000, waitBadge);
      }
      restore();
    }
}

POSS.getBuyerInfo = function(badge){
    doRequest("getBuyerInfo", {
        badge_id: badge},
      POSS.getBuyerInfo_result);
}

POSS.cancel = function(pur_id){
  doRequest('cancel', {purchase_id: pur_id}, function(){ $("#pur_"+pur_id).hide(); });
}


POSS.getBuyerInfo_result = function(r){
  if(r.success){
    var annulation = "";
    for(var pur_id in r.success.last_purchase){
      annulation += "<div id=\"pur_"+pur_id+"\" ><br /><button class=\"btn btn-large btn-danger\" onclick=\"POSS.cancel("+pur_id+");\"> Annuler un "+articles[r.success.last_purchase[pur_id].obj_id].nom+" à "+articles[r.success.last_purchase[pur_id].obj_id].prix+"€</button><br /></div>";
    }
    $("#infodata").html("Utilisateur : "+r.success.firstname+" "+r.success.lastname+"<br />"
    +"Solde : "+formatEuros(r.success.solde/100)
    +"<br /><button class=\"btn btn-primary btn-large\" onclick=\"PRINTER.Solde("+r.success.solde+",'"
    +r.success.firstname+"','"+r.success.lastname+"');\"> Imprimer </button><br />"
    +annulation);
    $("#BuyerInfo").modal();
    restore();
    waitBadge();
  }
  else {
    $("#status").html("Erreur n°"+r.error+"<br />"+r.error_msg).effect("highlight", {color: "#FF0000"}, 1500, waitBadge);
    restore();
  }
  
}