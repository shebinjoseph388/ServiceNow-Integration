module.exports = {
    logResponse: function(options, response, body) {
        if(options.verbose) {
            console.log("RESPONSE " + response.statusCode);
            console.log("RESPONSE headers"); console.log(response.headers);
            console.log("RESPONSE body"); console.log(JSON.stringify(body, null, 2));
        }
    }
}