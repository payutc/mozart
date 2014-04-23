// Websocket for reading cards and printing
mozartApp.factory('JCappucinoService', function() {

 
  var service = {
    callback: {}
  };

  //MOCKS while waiting that jcappucino works on Windows

  service.mockCard = function() {
    return "A123456";
  }

  // Actual implementation
   /*
 
  service.connect = function() {
    if(service.ws) { return; }
 
    var ws = new WebSocket(JCAPPUCINO_APPLET);
 
    ws.onopen = function() {
      console.log("Websocket ready");
    };
 
    ws.onerror = function() {
      console.log("Failed to open websocket");
    };
 
    ws.onmessage = function(message) {
      var data = message.data.split(':');
      var event = data[0], data = data[1];
      for(i in service.callback[event]) {
        service.callback[event][i](data);
      }
    };

    service.ws = ws;
  }
 
  service.send = function(event, message) {
    service.ws.send(event + ':' + message);
  }
 
  service.subscribe = function(event, callback) {
    if(!service.callback[event]) {
      service.callback[event] = [];
    }
    service.callback[event].push(callback);
  }
 
  service.connect();
  */
  return service;
 
});