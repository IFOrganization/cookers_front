/**
 * Created by kimsungwoo on 2015. 10. 16..
 */
angular.module('cookers.services')
    .factory('yummyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function calculateYummy(yummyData)
             * 아래의 checkyummyClicked 판별 여부에따라 DB pull, push를 요청하는 메서드
             */

            var address = cookers_config.url;
            var yummy = {};
            yummy.yummydataHttpRequest= function(requestyummyData){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/yummy",
                    /*url: "http://localhost:3000/rest/cooks/cookSteps/yummy",*/
                    method: 'POST',
                    data: requestyummyData
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return yummy;
        }])
    .factory('checkmyyummyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * cookStep에 들어가기 전 해당 cook이 내 yummyList에 있는지
             * 체크하는 서비스
             */

            var address = cookers_config.url;
            var yummy = {};
            yummy.checkyummyHttpRequest= function(requestyummyData){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/checkmyYummy",
                    /*url: "http://localhost:3000/rest/cooks/cookSteps/checkmyYummy",*/
                    method: 'POST',
                    data: requestyummyData
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return yummy;
        }]);
