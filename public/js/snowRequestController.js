snowRequestController.controller('snowRequestCtrl', ['$scope', '$rootScope', '$window', '$http', '$location', 'loginService', function($scope, $rootScope, $window, $http, $location, loginService) {
    $scope.loginService = loginService;
    $scope.loadingRequests = false;

    angular.element(document).ready(function() {
        $scope.getRequests();
    });

    $scope.getRequests = function() {
        $scope.loadingRequests = true;

        $http.get('/requestlist', {}).success(function(data, status, header, config) {
            $rootScope.snowRequests = data.result;
            
            if($rootScope.snowRequests)
                $rootScope.snowRequests = $scope.getOrderByKey($rootScope.snowRequests);
            
                if($window.Storage) 
                    $window.sessionStorage.setItem('snowRequests', JSON.stringify($rootScope.snowRequests));
                    $scope.loadingRequests = false;
                    $scope.errorMessage = data;
                    //$scope.$apply();
        });
    }

    $scope.getOrderByKey = function(map) {
        var sortedMap = {};
        var keys = [];

        for (var k in map) {
            keys.push(k);
        }
        keys.sort();
        for (var idx = 0; idx < keys.length; idx++) {
            sortedMap[keys[idx]] = map[keys[idx]];
        }
        return sortedMap;
    }
}
]);

