mozartApp.service('mrequest', ['$http', function($http){
    
    this.do = function(service, method, data){ 
        var str = [];
        for(var p in data)
            if (data.hasOwnProperty(p))
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));

        return $http({
            withCredentials: true,
            method: 'POST',
            url: server_url + service + '/' + method,
            data: str.join("&"),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }
}]);
 