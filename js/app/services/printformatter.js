// Websocket for reading cards and printing
mozartApp.factory('PrintFormatter', ['DataService', function(DataService){

    var PRINTER = {};

    PRINTER.repeat = function(str, num) {
        return new Array(num + 1).join(str);
    }

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/string/wordwrap [rev. #2]
    PRINTER.wordWrap = function(txt, m, b, c){
        var i, j, l, s, r;
        if(m < 1)
            return txt;
        for(i = -1, l = (r = txt.split("\n")).length; ++i < l; r[i] += s)
            for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
                j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
                || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
        return r.join("\n");
    };

    // 42 avec FONT0, 54 avec FONT1
    PRINTER.nbCols = 42;

    PRINTER.chr = function(i) {
         return String.fromCharCode(i);
    } 

    PRINTER.codes = {
    	formFeed 		: "\x0D",
    	lineFeed 		: "\x0A",
      Init: "\x1B\x40",
      Cut: "\x1D\x56\x41"
    }

    PRINTER.fmt_number = function(number) {
        if (number >= 10)
            return number.toString();
        else
            return "0" + number.toString();
    }

    PRINTER.formatPrix = function(montant) {
      return montant.toFixed(2).replace(".", ",")+" €";
    }

    PRINTER.get_date = function() {
    	  var dateString = "";
    	  var newDate = new Date();
    	  dateString += PRINTER.fmt_number(newDate.getDate()) + "/";
     	  dateString += PRINTER.fmt_number(newDate.getMonth() + 1) + "/";
    	  dateString += newDate.getFullYear() + " ";
    	  dateString += PRINTER.fmt_number(newDate.getHours()) + ":";
    	  dateString += PRINTER.fmt_number(newDate.getMinutes()) + ":";
    	  dateString += PRINTER.fmt_number(newDate.getSeconds());
    	  return dateString;
    }

    PRINTER.center = function(txt, taille) {
    	return PRINTER.repeat(" ", Math.round(taille/2 - txt.length/2)) + txt;
    }

    PRINTER.Ticket = function(infos) {
      var products = infos.purchases;
    	var total = 0, txt = "";

    	txt += PRINTER.codes.lineFeed;
    	txt += PRINTER.get_date();
      txt += PRINTER.codes.lineFeed;
    	txt += infos.firstname + " " + infos.lastname;
    	txt += PRINTER.repeat(PRINTER.codes.lineFeed, 2);

    	for(var i=0; i < products.length; i++){
        var product = products[i],
        	  total_temp = product.pur_price/100,
        	  espace_dizaine = product.pur_qte > 9 ? "" : " ";
   	  console.log(DataService.store.products[product.obj_id]);
        var ligne = espace_dizaine + product.pur_qte + " " + DataService.store.products[product.obj_id].name + PRINTER.formatPrix(total_temp);
    
        txt += espace_dizaine + product.pur_qte + " " + DataService.store.products[product.obj_id].name;
        txt += PRINTER.repeat(" ", PRINTER.nbCols - ligne.length)
        txt += PRINTER.formatPrix(total_temp);
        txt += PRINTER.codes.lineFeed;
    
        total += total_temp;
      }
	
      var ligneTotal = "Total   " + PRINTER.formatPrix(total);
      txt += PRINTER.printMode(0, true, false, false, false);
    	txt += PRINTER.repeat(" ", PRINTER.nbCols - ligneTotal.length) + ligneTotal;
      txt += PRINTER.printMode(0, false, false, false, false);
    	txt += PRINTER.repeat(PRINTER.codes.lineFeed, 2);
  
      txt += "Nouveau solde payutc : " + PRINTER.formatPrix(infos.solde/100);
    	txt += PRINTER.codes.lineFeed;

    	txt += PRINTER.center("---", PRINTER.nbCols)
    	txt += PRINTER.codes.lineFeed;

    	txt += PRINTER.wordWrap(infos.msg_perso, PRINTER.nbCols - 4, "\n", 0)
    					.split("\n")
    					.map(function(x) { return PRINTER.center(x, PRINTER.nbCols); })
    			    .join(PRINTER.codes.lineFeed);
    	txt += PRINTER.codes.lineFeed;

    	return PRINTER.print(txt);
    }

    PRINTER.logo = function (kc1, kc2) {
      var output = "\x1D\x28\x4C\x06\x00\x30\x45";
      output += PRINTER.chr(kc1);
      output += PRINTER.chr(kc2);
      output += "\x01\x01";
      return output;
    }

    PRINTER.printMode = function(font, emph, doubleh, doublew, underline){
      var n = font;
      n += emph ? 8 : 0;
      n += doubleh ? 16 : 0;
      n += doublew ? 32 : 0;
      n += underline ? 128 : 0;
      return "\x1B\x21" + PRINTER.chr(n);
    }

    PRINTER.print = function (txt) {
    	var output = "";
    	output += PRINTER.codes.Init;
  
      // Select font 0
    	output += PRINTER.printMode(0, false, false, false, false);
  
      // Charset WPC1252
    	output += "\x1B\x74\x10";
  
      // Logo
      output += PRINTER.logo(48, 48);
	
      // Data
    	output += txt;

    	output += PRINTER.codes.Cut;
    	output += PRINTER.codes.Init;
  
      return output;
    }

    return PRINTER;
}]);