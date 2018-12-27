/*
  This module handles the login requests.
 */

module.exports = {
    login: function(serverRequest, serverResponse) {
        var bodyString = '';
        var body = {};
        // console.log('inside login_routes, login, serverRequest'+serverRequest);
        // console.log('inside login_routes, login, serverResponse'+serverResponse);
        serverRequest.on('data', function(data){
            // console.log('inside login_routes, on'+data);
            bodyString += data;
            // console.log('inside login_routes, on'+bodyString);
        });
        serverRequest.on('end', function() {
            body = JSON.parse(bodyString);
            // console.log('inside login_routes, end'+body);
            var Auth = serverRequest.app.get('auth');
            var options = serverRequest.app.get('options');
            var snAuth = new Auth(body.hosturl, body.username, body.password, options);

            serverRequest.session['snConfig'] = {};
        serverRequest.session.snConfig['snInstanceURL'] = body.hosturl;

        snAuth.authenticate(function(error, response, body, cookie) {
            serverRequest.app.get('respLogger').logResponse(options, response, body);
            if(response) {
                if(response && response.statusCode == 200) {
                    serverRequest.session.snConfig['snCookie'] = cookie;
                    serverResponse.status(response.statusCode).send(body);
                } else if(response && response.statusCode == 401) {
                    serverResponse.status(response.statusCode).send("Invalid Username or Password");
                } else {
                    serverResponse.status(response.statusCode).send('Error occured while communicating with ServiceNow instance. ')
                }
            } else {
                serverResponse.status(500).send('Error occured while communicating with ServiceNow instance. ');
            }
        });
        });

        


    }
}