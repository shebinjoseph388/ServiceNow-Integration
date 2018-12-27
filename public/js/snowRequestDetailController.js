//import { stat } from "fs";

snowRequestController.controller('snowRequestDetailCtrl', ['$scope', '$rootScope',
    '$routeParams', '$http', '$location', '$window', '$route', '$routeParams', 'loginService', 
    function($scope, $rootScope, $routeParams, $http, $location, $window, $route, $routeParams,loginService){
        $scope.loginSvc = loginService;
        $scope.infoMessage = '';
        $scope.errorMessage = '';
        $scope.transactionComplete = false;
        $scope.complete = function () {
            $scope.transactionComplete = true;
            //Once user checks out, make the shopping cart empty
            // $scope.store.userProducts = [];
            // $scope.cart.total = 0.00;
        }
        angular.element(document).ready(function() {
            if (!$window.sessionStorage.getItem('snowRequests')) {
                $location.url('/login');
                $scope.$apply();
            } else {
                if(!$rootScope.snrequests)
                    $rootScope.snrequests = JSON.parse($window.sessionStorage.getItem('snowRequests'));
                console.log($rootScope.snrequests);
                console.log($rootScope.snrequest);
                $scope.getsnowDetails();
                // if($routeParams.type && $routeParams.id) {
                //     $scope.snrequest = $rootScope.requests[$routeParams.type][$routeParams.id];
                // }
               
                if ($scope.snrequest) {
                    $scope.getsnowDetails();
                }
            }
        });

        $scope.getsnowDetails = function() {
            $scope.infoMessage = 'Loading Details...';
            //$http.get('/snrequest/' + $scope.snrequest.sys_id + '/details', {}).success(
            $http.get('/snrequest/' + $routeParams.type + '/details', {}).success(
                function(data, status, headers, config) {
                    $scope.status = status;
                    $scope.infoMessage = '';
                    $scope.details = data.result[0];
                    $scope.jsonData={};
                    $scope.deploymentDate = $scope.details.description.match(/\d{2}(\D)\d{2}\1\d{4}/g);
                    $scope.deploymentDate = $scope.deploymentDate[0];
                    var splittedText = $scope.details.description.split('[');
                    for (var i = 1; i < splittedText.length; i++) { 
                        var versionstring = splittedText[i].split(']')[0];
                        var versions=versionstring.split(';');
                        versions.forEach(function(version){
                            var key=version.split(':')[0];
                            $scope.jsonData[key]=version.split(':')[1];
                        });

                    }
                    
                }).error(function(data, status, headers, config) {
                    $scope.status = status;
                    $scope.infoMessage = '';
                    $scope.errorMessage = status + " : " + data;
                });
        }

        $scope.createChange = function() {
            var body = {};
            body.versions = $scope.jsonData;
            var deploymentConfig = [{
                'region': 'us-east-1',
                'extension': 'com',
                'start_date': '21:00:00',
                'end_date': '21:30:00'
            },{
                'region': 'eu-west-1',
                'extension': 'ie',
                'start_date': '20:30:00',
                'end_date': '21:00:00' 
            },{
                'region': 'ca-central-1',
                'extension': 'ca',
                'start_date': '20:00:00',
                'end_date': '20:30:00'
            },{
                'region': 'ap-southeast-2',
                'extension': 'au',
                'start_date': '11:00:00',
                'end_date': '11:30:00'
            }];
            if (deploymentConfig.length > 0) {
                var exit = false;
                var len = deploymentConfig.length - 1;
                $scope.executePost(0, deploymentConfig, len, body, $scope.deploymentDate);
            }
            //console.log($scope.deploymentDate);
            // for(var i=0; i<deploymentConfig.length; i++){
            //     $scope.infoMessage = 'Creating change request '+ (i+1);
            //     body.region = deploymentConfig[i].region;
            //     body.extension = deploymentConfig[i].extension;
            //     body.start_date = $scope.deploymentDate + ' ' + deploymentConfig[i].start_date;
            //     body.end_date = $scope.deploymentDate + ' ' + deploymentConfig[i].end_date;
            //     console.log(body);
            //     $http.post('/createchange', body).success(
            //         function(data, status, headers, config) {
            //             console.log(body);
            //             $scope.infoMessage = '';
            //             body.region = '';
            //             body.extension = '';
            //             body.start_date = '';
            //             body.end_date = '';
            //         }).error(function(data, status, headers, config){
            //             $scope.infoMessage = '';
            //             body.region = '';
            //             body.extension = '';
            //             body.start_date = '';
            //             body.end_date = '';
            //             $scope.errorMessage = status +  " : " + data;
            //         });
            // }

            // for(var version in jsonData) {
            //     if(jsonData.hasOwnProperty(version)) {
                   
            //     }
            // }
        }
        $scope.executePost = function(i, deploymentConfig, len, body, deploymentDate) {
            if ( deploymentConfig[i] != undefined && (i <= len)) {
                body.region = deploymentConfig[i].region;
                body.extension = deploymentConfig[i].extension;
                body.start_date = $scope.deploymentDate + ' ' + deploymentConfig[i].start_date;
                body.end_date = $scope.deploymentDate + ' ' + deploymentConfig[i].end_date;

                $http.post('/createchange', body).success(
                    function(data, status, headers, config) {
                        console.log("Processed  " + (i + 1));  
                        console.log(body);
                        $scope.infoMessage = '';
                        body.region = '';
                        body.extension = '';
                        body.start_date = '';
                        body.end_date = '';
                        if ((i + 1) <= len) {
                            $scope.executePost(i + 1, deploymentConfig, len, body, deploymentDate);
                        }
                    }).error(function(data, status, headers, config){
                        console.log("Unsuccessfull  " + (i + 1)); 
                        $scope.infoMessage = '';
                        body.region = '';
                        body.extension = '';
                        body.start_date = '';
                        body.end_date = '';
                        $scope.errorMessage = status +  " : " + data;
                    });
            }
        }
    }
]);