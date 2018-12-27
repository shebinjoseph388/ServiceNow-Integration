module.exports = {
    getSnowRequests: function(serverRequest, serverResponse) {
        if (serverRequest.session && serverRequest.session.snConfig && serverRequest.session.snConfig.snCookie) {
            var SNRequest = serverRequest.app.get('SnowRequests');
            var options = serverRequest.app.get('options');
            var snRequest = new SNRequest(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
            snRequest.getRequests(function(error, response, body) {
                serverRequest.app.get('respLogger').logResponse(options, response, body);
                if(!error) {
                    if (response.statusCode == 200) {
                        serverResponse.status(response.statusCode).send(body);
                    } else if(response.statusCode == 400) {
                        serverResponse.status(response.statusCode).send('The Task Tracker API is not found on this instance. Did you install the "My Work" Update Set?');
                    } else {
                        serverResponse.status(response.statusCode).send('Error occured while communicating with ServiceNow instance. ' + response.statusMessage);
                    }
                } else {
                    serverResponse.status(500).send('Error occured while communicating with ServiceNow instance. ');
                }
            });

        } else {
            serverResponse.status(401).send('User session invalidated');
        }
    },
    getSnowRequestDetails: function(serverRequest, serverResponse) {
        var SNRequest = serverRequest.app.get('SnowRequests');
        var options = serverRequest.app.get('options');
        var snRequest = new SNRequest(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
        snRequest.getSnowRequestDetails(serverRequest.params.requestid, function(error, response, body) {
            serverRequest.app.get('respLogger').logResponse(options, response, body);
            serverResponse.status(response.statusCode).send(body);
        });
    },
    createChange: function(serverRequest, serverResponse) {
        var bodyString = '';
        serverRequest.on('data', function(data) {
            bodyString += data;
        });

        serverRequest.on('end', function(){
            var body = JSON.parse(bodyString);
            var SNRequest = serverRequest.app.get('SnowRequests');
            var options = serverRequest.app.get('options');
            var snRequest = new SNRequest(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
            snRequest.createChange(body, function(error, response, body) {
                serverRequest.app.get('respLogger').logResponse(options, response, body);
                if (!error) {
                    serverResponse.status(response.statusCode).send(body);
                }
                
            });
        });
    }
 }