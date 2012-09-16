String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

var PRINTER = {};

function chr(i) {
     return String.fromCharCode(i);
} 

var code = {
	formFeed 		: chr(12),
	lineFeed 		: chr(10),
	reverseFeed 	: chr(27) + chr(74),
	newLine 		: '\n',
	CR 				: '\r',
	init 			: chr(27) + chr(64),
	bold 			: chr(27) + chr(69),
	regular 		: chr(27) + chr(70),
	condensed 		: chr(15),
	noCondensed 	: chr(18),
	bigFont 		: chr(27) + 'w1' + chr(27) + 'W1',
	noBigFont 		: chr(27) + 'w0' + chr(27) + 'W0',
	vSpacing6LPI 	: chr(27) + chr(50),
	vSpacing8LPI 	: chr(27) + chr(48),
	/* Box drawing component */
	drawLine 		: chr(196),
	drawDLine 		: chr(205),
	topLeft 		: chr(218),
	topRight 		: chr(191),
 	vLine 			: chr(33),
	vIntersectR 	: chr(180),
	vIntersectL 	: chr(195),
	vIntersectTC 	: chr(194),
	intersect	 	: chr(197),
	vIntersectBC 	: chr(193),
	bottomLeft 		: chr(192),
	bottomRight 	: chr(217),
}

PRINTER.Init = "\x1B\x40";
PRINTER.Cut = "\x1D\x56\x41";

//helper
PRINTER.cc = function(line, newline) {
	return $("<div>").addClass("newLine")
				     .addClass("dPrint").text(line)	
}

PRINTER.get_date = function() {
	var dateString = "";
	var newDate = new Date();
	dateString += "le "
	dateString += newDate.getDate() + "/";
 	dateString += (newDate.getMonth() + 1) + "/";
	dateString += newDate.getFullYear() + " à ";
	dateString += newDate.getHours() + ":";
	dateString += newDate.getMinutes() + ":";
	dateString += newDate.getSeconds();

	return dateString;
}
PRINTER.newline = chr(10);
PRINTER.titre = "PICASSO - FOYER ETUDIANT";
PRINTER.entete = " ".repeat(25 - PRINTER.titre.length/2) + "\x1B\x21\x02" + PRINTER.titre + "\x1B\x21\x01\x1B\x7B\x01"

PRINTER.Solde = function(solde, firstname, lastname) {
	var txt = "", 
		newline = PRINTER.newline,
		date = PRINTER.get_date();
	
	txt += PRINTER.entete;
	txt += newline.repeat(2);
	txt += date;
	txt += newline.repeat(2);

	var nom_prenom = firstname + " " + lastname;

	txt += nom_prenom;
	txt += newline;
	txt += "Vous avez " + solde / 100 + "€ sur votre compte.";
	txt += newline.repeat(5);

	PRINTER.print(txt);

}

PRINTER.Ticket = function(products, infos) {	
	var newline = PRINTER.newline,
		date = PRINTER.get_date(),
		nom_prenom = infos.firstname + " " + infos.lastname,
		msg_perso = infos.msg_perso,
		entete = PRINTER.entete,
		total = 0,
		txt = [];

	txt += entete;
	txt += newline.repeat(2);
	txt += date;
	txt += newline.repeat(2);
	txt += nom_prenom;
	txt += newline.repeat(2);
	
	for(var i=0;i<products.length;i++){
      var nom_produit = articles[products[i].article].nom,
      	  quantite_produit = products[i].quantite,
      	  total_temp = Math.round(100*articles[products[i].article].prix*products[i].quantite)/100,
      	  espace_dizaine = quantite_produit > 9 == 0 ? 0 : 1,
      	  total = total + total_temp;
     	
      txt += quantite_produit + "*" + nom_produit + " ".repeat(40 - nom_produit.length - espace_dizaine) + "->   " + total_temp + "€";
      txt += newline;
    }
	
    var taille_total = total.toLocaleString().length,
    	total = " ".repeat(43 - taille_total) + "Total : " + total + "€",
		infos = " Il vous reste "+infos.solde/100+" € sur votre compte.";

	txt += newline;
	txt += total;
	txt += newline;
	txt += infos;
	txt += newline;
	txt += msg_perso;
	txt += newline;
	console.log(txt);
	PRINTER.print(txt);
}

PRINTER.print = function (txt) {
	var applet = document.jzebra;
	applet.append(PRINTER.Init);
	
	applet.append("\x1B\x21\x01"); // 3
	applet.append("\x1B\x74\x10")
	
	applet.append(txt);

	applet.append(PRINTER.Cut);
	applet.append(PRINTER.Init); // 5
	applet.print();
}