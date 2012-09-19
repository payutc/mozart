var categories;
var articles;

var lignes = [];
var nbBoutons = 30;
var nbCategories = 5;
var activeCategorie = 0;

var soapurl = {
    poss: "api.php"
};


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
        if(aid != 0 && articles[aid]) {
            $button = $("#tableau-articles button:eq("+i+")");
            $button.html(articles[aid].nom).attr("aid", aid).removeAttr("disabled");
            if (localStorage["background_" + aid])
                $button.css("background", localStorage["background_" + aid])
            if (localStorage["text_" + aid])
                $button.css("color", localStorage["text_" + aid])

        }
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

function restore(){
    lignes.length = 0;
    updateLignes();
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
  $.post(soapurl.poss+"?method="+method, data, callback, 'json');
}

$(document).ready(function(){
    // Mise à jour d l'heure
    window.setInterval(function(){
        var dt = new Date();
        $("#time").html(dt.toLocaleTimeString());
    }, 1000);
    
    // Clic sur les boutons de catégories
    $("#tableau-categories button").click(function(){
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
    
    // Remise à zéro de la caisse
    restore();
    
    // Connexion du vendeur
    POSS.isLoadedSeller();
    
    // Vérification du bon démarrage de concerto
    
});

// -----------------------
// page choix des couleurs
// -----------------------
function liste_articles() {
    doRequest("getArticles", {}, liste_articles_res);
}

function liste_articles_res(res) {
    if (res.success) {
        articles = res.success.articles
    }
    else {
        console.log("erreur lors de la recuperation des articles")
    }

    $articles = $("#articles");
    $article = $("<div class='span3 article'><div class='nom_article'></div><div class='couleur'></div><div class='test'><button class='btn'></button></div></div>");
    $background_colorpicker = $('<div class="input-append color" data-color="#FFFFFF" data-color-format="hex"><input type="text" class="span2" value="" ><span class="add-on"><i style="background-color: rgb(255, 146, 180)"></i></span></div>');

    if (!localStorage["couleurs_articles"]) 
        localStorage["couleurs_articles"] = {};

    update_button = function(id_article) {
        $button = $("button", "#article_" + id_article);
        if (localStorage["background_" + id_article]) {
            $button.css("background", localStorage["background_" + id_article]);
            console.log("pop")
        }
        if (localStorage["text_" + id_article])
            $button.css("color", localStorage["text_" + id_article]);
        console.log($button)
    }

    change_color_ev = function(which) {
        return function(ev) {
                var id_article = ev.currentTarget.id.slice(which.length + 4);
                localStorage[which +"_" + id_article] = ev.color.toHex();
                update_button(id_article);

        }
    }
    
    var background_change_color_ev = change_color_ev("background"),
        text_change_color_ev = change_color_ev("text");

    for (article in articles) {
        var article = articles[article],
            $new_article = $article.clone();
        
        $articles.append($new_article);
        $new_article.attr("id", "article_" + article.id);
        $(".nom_article", $new_article).text(article.name);
        $(".test button", $new_article).text(article.name);

        var $background_cp = $background_colorpicker.clone(),
            $text_cp = $background_colorpicker.clone();

        //on remplit les champs si ya deja des couleurs dans le localStorage
        if (localStorage["background_" + article.id]) {
            $background_cp.attr("data-color", localStorage["background_" + article.id])
            $("input", $background_cp).attr("value", localStorage["background_" + article.id])
            $("button", $new_article).css("background", localStorage["background_" + article.id]);
        }
        
        if (localStorage["text_" + article.id]) {
            $text_cp.attr("data-color", localStorage["text_" + article.id])
            $("input", $text_cp).attr("value", localStorage["text_" + article.id])
            $("button", $new_article).css("color", localStorage["text_" + article.id]);

        }
        
        //on crée les color picker et on leur attache les bons evenements
        $background_cp.colorpicker({"format" : "hex"}).on("changeColor", background_change_color_ev);
        $text_cp.colorpicker({"format" : "hex"}).on("changeColor", text_change_color_ev);
        
        $background_cp.attr("id", "background_cp_" + article.id);
        $(".couleur", $new_article).append($background_cp);

        $text_cp.attr("id", "text_cp_" + article.id);
        $(".couleur", $new_article).append($text_cp);


    }
}