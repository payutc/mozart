var categories;
var articles;

var lignes = [];
var nbBoutons = 30;
var nbCategories = 5;
var activeCategorie = 0;

var transactionInProgress = false;

var soapurl = {
    poss: "api.php"
};

var casUrl = "";

// Met à jour les catégories
function updateCategories(){
    // Update depuis serveur
    $("#tableau-categories button").each(function(){
      $(this).html("").attr("disabled", "disabled");
    });
    
    var i = 0;
    for(var key in categories){
        var categorie = categories[key];
        $("#tableau-categories button:eq("+i+")").attr("catid", key)
          .removeClass("active").removeAttr("disabled").html(categorie.nom);
        i++;
    }
}

// Affiche une categorie
function showButtons(categorie){
    if(categorie == -1){
      for (first in categories) break;
      categorie = first;
    }
  
    activeCategorie = categorie;
    
    // Mise à jour du style des boutons
    for(i=0;i<nbCategories;i++){
        var btn = $("#tableau-categories button:eq("+i+")");
        if(btn.attr("catid") == activeCategorie)
            btn.addClass("active");
        else
            btn.removeClass("active");
    }
    
    for(i=0;i<nbBoutons;i++){
        var aid = categories[categorie].articles[i];
        var button = $("#tableau-articles button:eq("+i+")");

        // Si le bouton est actif
        if(aid != 0 && articles[aid]) {
            button.html(articles[aid].nom)
                   .attr("aid", aid)
                   .removeAttr("disabled");
            
            button.css("font-size", "");
            button.css("background", "");
            
            if(articles[aid].image){
                button.css("background", "no-repeat center center url(data:image/png;base64," + articles[aid].image + ")");
                button.css("font-size", "0");
            }
        }
        else {
            button.html("")
                   .removeAttr("aid")
                   .attr("disabled", "disabled")
                   .css("background", "");
        }
    }
}

function updateLignes(){
    $("#lignes").html("");
    var total = 0;
    if(lignes.length == 0)
        $("#lignes").append('<tr><td>Aucun article sélectionné</td><td></td><td></td></tr>');
    else {
        for(i=0;i<lignes.length;i++){
            var article = articles[lignes[i].article];
            var ligne = lignes[i];
            $("#lignes").append('<tr>'+
              '<td>'+article.nom+'</td>'+
              '<td>'+ligne.quantite+' <!--<button class="btn btn-danger">-</button>--></td>'+
              '<td>'+formatEuros(article.prix*ligne.quantite)+'</td>'+
            '</tr>');
            total += article.prix*ligne.quantite;
        }
    }
    // Ajout du total
    $("#lignes").append('<tr>'+
      '<td><b>Total</b></td>'+
      '<td></td>'+
      '<td><b>'+formatEuros(total)+'</b></td>'+
    '</tr>');
}

function restore(){
    lignes.length = 0;
    updateLignes();
    transactionInProgress = false;
}

function waitBadge(){
    $("#status").html("Passer un badge pour valider");  
}

function formatEuros(montant){
    return montant.toFixed(2).replace(".",",")+" €";
}

function CSVToArray(strData, strDelimiter){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        ("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ), "gi");

    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)){
        var strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter))
            arrData.push([]);
        if (arrMatches[2])
            var strMatchedValue = arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"");
        else
            var strMatchedValue = arrMatches[3];
        arrData[arrData.length-1].push(strMatchedValue);
    }
    return(arrData);
}

function updateJS(status, data){
    switch(status){
        case "cardInserted":
            if(lignes.length > 0){
                $("#status").html("Paiement en cours... <b>Ne pas retirer le badge !</b>");
                POSS.transaction(data.toUpperCase());
            }
            else {
              $("#status").html("Lecture en cours... <b>Ne pas retirer le badge !</b>");
              POSS.getBuyerInfo(data.toUpperCase());
            }
        break;
    }
}

function doRequest(method, data, callback){
  $.post(soapurl.poss+"?method="+method, data, callback, 'json').error(POSS.transaction_result);
}

$(document).ready(function(){
    // Mise à jour d l'heure
    window.setInterval(function(){
        var dt = new Date();
        $("#time").html(dt.toLocaleTimeString());
    }, 1000);
    
    // Clic sur les boutons de catégories
    $("#tableau-categories button").click(function() {
        showButtons($(this).attr("catid"));
    });
    
    // Clic sur les boutons d'articles
    $("#tableau-articles button").click(function(){
        var aid = $(this).attr("aid");
        for(i=0;i<lignes.length;i++){
            if(lignes[i].article == aid){
                lignes[i].quantite++;
                updateLignes();
                return;
            }
        }
        lignes.push({
           article: aid,
           quantite: 1
        });
        updateLignes();
    });
    
    // Clic sur effacer tout
    $("#effacertout").click(function(){
       lignes.length = 0;
       updateLignes(); 
    });
    
    // Clic sur déconnexion
    $("#btnlogout").click(function(){
      POSS.logout();
    });
    
    // Remise à zéro de la caisse
    restore();
    waitBadge();
    
    // Récupération et stockage de l'URL du CAS
    doRequest("getCasUrl", {}, POSS.casUrlReceived);
    
    // Vérification du bon démarrage de concerto
    
    // Changement de la hauteur
    $(window).resize(function(){
      var height = $(document).height() - $("#topbar").height() - parseInt($("#topbar").css("margin-bottom"), 10) - 10;
      console.log(height);
      $('.fill').height(height);
    })
    $(window).resize();
    
});
