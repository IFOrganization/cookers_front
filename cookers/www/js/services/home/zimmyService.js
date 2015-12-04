/**
 * Created by kimsungwoo on 2015. 10. 31..
 */
angular.module('cookers.services')
    .factory('zimmyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function zimmydataHttpRequest(cook_id)
             * 사용자가 찜한 cook을 cook model에 저장
             */

            var address = cookers_config.url;
            var zimmy = {};
            zimmy.zimmydataHttpRequest= function(zimmyData){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/zimmy",
                    /*url: "http://localhost:3000/rest/cooks/cookSteps/yummy",*/
                    method: 'POST',
                    data: zimmyData
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return zimmy;
        }])
    .factory('checkmyzimmyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            var address = cookers_config.url;
            var zimmy = {};
            zimmy.checkzimmyHttpRequest= function(requestzimmyData){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/checkmyZimmy",
                    method: 'POST',
                    data: requestzimmyData
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return zimmy;
        }]);
