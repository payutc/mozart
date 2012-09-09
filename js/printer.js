var PRINTER = {};

function chr(i) {
              return String.fromCharCode(i);
        } 

PRINTER.Init = function(){
	var applet = document.jzebra;
	applet.append("\x1B\x40");
}

PRINTER.ResetStyles = function() {
	var applet = document.jzebra;
	applet.append("\x1B\x21\x00");
}

PRINTER.Cut = function() {
    var applet = document.jzebra;
	applet.append('\x1D\x56\x41');
}

PRINTER.boldAndCenter = function() {
    document.jzebra.append(chr(27) + chr(69) + "\r");  // bold on
    document.jzebra.append(chr(27) + "\x61" + "\x31"); // center justify
}

PRINTER.Entete = function() {
	var applet = document.jzebra;
	PRINTER.boldAndCenter();
	applet.append(" PICASSO \r\n");
	applet.append(" Foyer Etudiant \r\n");
	PRINTER.ResetStyles();
}

PRINTER.Solde = function(solde, firstname, lastname) {
	var applet = document.jzebra;
	PRINTER.Init();
	PRINTER.ResetStyles();
	PRINTER.Entete();
applet.append("\x1B\x21\x01"); // 3
applet.append(" -------------------------------------------------- \r\n");
applet.append(" "+firstname+" "+lastname+" \r\n");
applet.append(" Il vous reste "+solde/100+" euros sur votre compte. \r\n\r\n");
applet.append(" -------------------------------------------------- \r\n");

	PRINTER.Cut();
applet.append("\x1B\x40"); // 5
applet.print();
}

PRINTER.ticket = function(products, infos) {
	var applet = document.jzebra;
	PRINTER.Init();
	PRINTER.ResetStyles();
	PRINTER.Entete();
applet.append("\x1B\x21\x01"); // 3
applet.append(" -------------------------------------------------- \r\n");
applet.append(" "+infos.firstname+" "+infos.lastname+" \r\n");
for(var i=0;i<products.length;i++){
      applet.append(" "+articles[products[i].article].nom+" \t"+products[i].quantite+" \t"+articles[products[i].article].prix*products[i].quantite+" \r\n");
    }
applet.append(" Il vous reste "+infos.solde/100+" euros sur votre compte. \r\n\r\n");
applet.append(" -------------------------------------------------- \r\n");

	PRINTER.Cut();
applet.append("\x1B\x40"); // 5
applet.print();

}