module.exports = BasicAuth;

function BasicAuth(url, username, password, options) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.options = options;
}

BasicAuth.prototype.authenticate = function(callBack) {
    var request = require('request');
    request.debug = this.options.verbose;
    request({
        baseUrl : this.url,
        method: 'GET',
        uri: 'api/now/v2/table/sys_user?sysparm_query=user_name%3D' + this.username,
        json: true,
        auth: {
            'user' : this.username,
            'pass' : this.password,
            'sendImmediately' : true
        }
    }, function(err, response, body) {
        if (!err && response.statusCode == 200){
            callBack(err, response, body, response.headers['set-cookie']);
        } else {
            callBack(err, response, body);
        }
    });
}