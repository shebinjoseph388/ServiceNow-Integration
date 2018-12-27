
snowRequestController.controller('loginCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$location', 'loginService',
    function($scope, $rootScope, $http, $location, loginService) {
    	
        $scope.loginSvc = loginService;
        $scope.instanceName = '';

        // register login function here. Login button of login.html will invoke this method when user wants to log in.
        $scope.login = function() {
        	// We assume service now end point in the following format.
            $scope.loginSvc.login('https://' + $scope.instanceName + '.service-now.com', $scope.userName, $scope.password).then(function(data, status, headers, config) {
                $location.path('/snowrequests');
            }, function(error) {
                $scope.errorMessage = error.status + " : " + error.message;
            })
        }
    }
]);
