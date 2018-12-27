var express = require('express');
var loginRoute = require('./routes/login_routes');
var snRequestsRoute = require('./routes/sn_requests_route')
var path = require('path');
var session = require('client-sessions');

var responseLogger = require('./common/responseLogger');
var usage = require('./common/usage');

var options = usage.processArgs(path.basename(__filename));

var auth = require('./api/basicAuth');
var SnowRequests = require('./api/snowRequests');

var app = express();
app.set('auth', auth);
app.set('SnowRequests', SnowRequests);
app.set('respLogger', responseLogger);
app.set('options', options);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    cookieName: 'session',
    secret: 'cdf*)))==asdf afcmnoadfadf',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

var router = express.Router();

router.post('/login', loginRoute.login);
router.get('/login', loginRoute.login);
router.get('/requestlist', snRequestsRoute.getSnowRequests);
router.get('/snrequest/:requestid/details', snRequestsRoute.getSnowRequestDetails);
router.post('/createchange', snRequestsRoute.createChange);
router.delete('/logout', function(req, res) {
    req.session.destroy();
    res.end('Deleted');
});

app.use(router);
app.listen(options.port);
console.log("Server listening on: http://localhost:%s", options.port);

