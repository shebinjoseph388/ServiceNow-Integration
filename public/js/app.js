var snowRequestController = angular.module('snowRequests.controllers', []);
var snowRequests = angular.module('snowRequests', ['ngRoute', 'snowRequests.controllers']);

snowRequests.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'view/login.html',
            controller: 'loginCtrl'
        }).when('/snowrequests', {
            templateUrl: 'view/snow_requests_list.html',
            controller: 'snowRequestCtrl'
        }).when('/:type/:id', {
           templateUrl: 'view/snow_request_detail.html',
           controller: 'snowRequestDetailCtrl' 
        }).otherwise({
            redirectTo: '/login'
        });
    }
]);

snowRequests.run(function($rootScope, $location) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        $rootScope.referrer = current;
    });
});

snowRequests.filter('isEmpty', function () {
    return function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
});