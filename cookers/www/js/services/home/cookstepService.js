/**
 * Created by kimsungwoo on 2015. 10. 14..
 */
angular.module('cookers.services')
    .factory('cookstepService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function getcookStep ()
             * 유저가 선택한 쿡의 스탭을 보여 줌
             */

            var address = cookers_config.url;
            var cookStep = {};
            cookStep.getcookStep = function(cook_id){

                var defer = $q.defer();
                $http({
                    url: address+"/rest/cooks/cookSteps/"+cook_id,
                    /*"http://localhost:3000/rest/cooks/cookSteps/"+cook_id,*/
                    method: 'POST'
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return cookStep;
        }])
    .factory('inchitService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function getcookStep ()
             * 유저가 선택한 쿡의 스탭을 보여 줌
             */

            var address = cookers_config.url;
            var request_obj = {};
            request_obj.increase_hit = function(cook_id){

                var defer = $q.defer();
                $http({
                    url: address+"/rest/cooks/increasehit/"+cook_id,
                    /*"http://localhost:3000/rest/cooks/cookSteps/"+cook_id,*/
                    method: 'POST'
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return request_obj;
        }]);

