// Websocket for reading cards and printing
mozartApp.factory('JCappucinoService', function() {

    var service = {
        callback: {}
    };

    //MOCKS while waiting that jcappucino works on Windows

    service.mockCard = function() {
        return "76E4BF3F";
    }

    service.connect = function() {
        if(service.ws) { return; }

        var ws = new WebSocket(JCAPPUCINO_APPLET);

        var handle = function(event, message) {
            for(i in service.callback[event]) {
                service.callback[event][i](message);
            }
        }

        ws.onopen = function() {
            handle("onopen", "");
        };

        ws.onerror = function() {
            handle("onerror", "");
        };

        ws.onmessage = function(message) {
            var data = message.data.split(':');
            var event = data[0], data = data[1];
            handle(event, data);
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
    return service;
});