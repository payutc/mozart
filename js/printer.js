String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/wordwrap [rev. #2]

String.prototype.wordWrap = function(m, b, c){
    var i, j, l, s, r;
    if(m < 1)
        return this;
    for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
        for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
            || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
    return r.join("\n");
};

var PRINTER = {};

function chr(i) {
     return String.fromCharCode(i);
} 

//Tronquage bitwise
function trunc(z){   
    return ~~z;
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
//helper
fmt_number = function(number) {
    if (number >= 10)
        return number.toString();
    else
        return "0" + number.toString();
}

PRINTER.get_date = function() {
	  var dateString = "";
	  var newDate = new Date();
	  dateString += "le "
	  dateString += fmt_number(newDate.getDate()) + "/";
 	  dateString += fmt_number(newDate.getMonth() + 1) + "/";
	  dateString += newDate.getFullYear() + " à ";
	  dateString += fmt_number(newDate.getHours()) + ":";
	  dateString += fmt_number(newDate.getMinutes()) + ":";
	  dateString += fmt_number(newDate.getSeconds());

	  return dateString;
}
PRINTER.newline = chr(10);

PRINTER.Solde = function(solde, firstname, lastname) {
	var txt = "", 
		newline = PRINTER.newline,
		date = PRINTER.get_date(),
        
	//txt += PRINTER.entete;
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

PRINTER.center = function(txt, taille) {
	return " ".repeat(Math.round(taille/2 - txt.length/2)) + txt;
}

PRINTER.Ticket = function(products, infos) {
	var newline = PRINTER.newline,
		date = PRINTER.get_date(),
		nom_prenom = infos.firstname + " " + infos.lastname,
		msg_perso = infos.msg_perso,
        titre  = POSS.fun_name,
		entete = " ".repeat(25 - trunc(titre.length/2)) + "\x1B\x21\x02" + titre + "\x1B\x21\x01\x1B\x7B\x01",
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
    	total = " ".repeat(43 - taille_total) + "Total : " + Math.round(100*total)/100 + "€",
		infos = " Il vous reste "+infos.solde/100+" € sur votre compte.";

	txt += newline;
	txt += total;
	txt += newline;
	txt += infos;
	txt += newline;
	txt += PRINTER.center("---", 54)
	txt += newline;

	msg_perso = msg_perso.wordWrap(50, "\n", 0)
					.split("\n")
					.map(function(x) { return PRINTER.center(x, 54); })
				    .join(newline); 
	
	txt += msg_perso;
	txt += newline;
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
