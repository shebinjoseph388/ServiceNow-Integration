snowRequests.service('loginService', ['$http', '$rootScope', '$location', '$q', '$window',
    function($http, $rootScope, $location, $q, $window) {
        this.login = function(url, username, password) {
            var deferred = $q.defer();
            // console.log($q);
            // console.log(deferred);
            var data = {};
            data['hosturl'] = url;
            data['username'] = username;
            data['password'] = password;

            $http.post('/login', data).success(function(data, status, headers, config) {
                return deferred.resolve(data, status, headers, config);
            }).error(function(data, status, headers, config) {
                var error = {}
                error.message = data;
                error.status = status;
                error.headers = headers;
                error.config = config;

                return deferred.reject(error);
            });
            return deferred.promise;
        }

        this.logout = function() {
            $http.delete('/logout').success(
                function(data, status, headers, config) {
                    $rootScope.tasks = null;

                    if($window.sessionStorage)
                        $window.sessionStorage.clear();

                    $location.url('/login');
                }).error(function(data, status, headers, config) {

                });
        }
    }
]);
