/**
 * Created by kimsungwoo on 2015. 10. 27..
 */
angular.module('cookers.services')
    .factory('searchService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {

            var address = cookers_config.url;
            var search = {};
            search.searchautocompleteHttpRequest= function(search_param){

                /**
                 * function searchautocompleteHttpRequest(search_param)
                 *  --> 검색의 자동완성 요청 메서드
                 * search_param : {
                 *      type : String (tag, cook, cookers),
                 *      search_text : String
                 * }
                 */
                var defer = $q.defer();
                $http({
                    url:address+"/rest/search",
                    /*url: "http://localhost:3000/rest/search",*/
                    method: 'POST',
                    data: search_param
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return search;
        }])
    .factory('searchbytagService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {

            var address = cookers_config.url;
            var tag_search = {};

            tag_search.getsearchresultbyTag= function(tag_param){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/search/tagsearch/" + tag_param,
                    method: 'POST'
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return tag_search;
        }]);
