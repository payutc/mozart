var categories;
var articles;

var lignes = [];
var nbBoutons = 25;
var nbCategories = 4;
var activeCategorie = 0;

var soapurl = {
    pbuy: "/buckutt/PBUY.class.php",
    poss: "/buckutt/POSS.class.php"
};


// Met à jour les catégories
function updateCategories(){
    // Update depuis serveur
    
    for(i=0;i<nbCategories;i++){
        var btn = $("#tableau-categories button:eq("+i+")");
        if(categories[i]){
            btn.attr("catid", i).removeClass("active").html(categories[i].nom);
            if(i == 0)
                btn.addClass("active");
        }
        else
            btn.html("").attr("disabled", "disabled");
    }
}

// Affiche une categorie
function showButtons(categorie){
    activeCategorie = categorie;
    
    // Mise à jour du style des boutons
    for(i=0;i<nbCategories;i++){
        var btn = $("#tableau-categories button:eq("+i+")");
        if(i == activeCategorie)
            btn.addClass("active");
        else
            btn.removeClass("active");
    }
    
    for(i=0;i<nbBoutons;i++){
        var aid = categories[categorie].articles[i];
        if(aid != 0 && articles[aid])
            $("#tableau-articles button:eq("+i+")").html(articles[aid].nom).attr("aid", aid).removeAttr("disabled");
        else
            $("#tableau-articles button:eq("+i+")").html("").removeAttr("aid").attr("disabled", "disabled");
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
                console.log("Paiement");
                $("#status").html("Paiement en cours...<br />").show();
                PBUY.loadBuyer(data.toUpperCase(), 5);
            }
        break;
    }
}

$(document).ready(function(){
    window.setInterval(function(){
        var dt = new Date();
        $("#time").html(dt.toLocaleTimeString());
    }, 1000);
    
    // Clic sur les boutons de catégories
    $("#tableau-categories button").click(function(){
        showButtons($(this).attr("catid"));
    });
    
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
    
    $("#effacertout").click(function(){
       lignes.length = 0;
       updateLignes(); 
    });
    
    updateLignes();
    //PBUY.loadSeller(); // Charge le seller de test et les propositions associées
    var params = jQuery.deparam.querystring();
    if(params.ticket){
      console.debug("Validation du ticket "+params.ticket);
      POSS.loadPOS(params.ticket);
    }
    else {
      POSS.sellerLogin();
    }
});