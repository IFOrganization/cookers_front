/**
 * Created by kimsungwoo on 2015. 10. 21..
 */
angular.module('cookers.services')
    .factory('addreplyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function addreplyHttpRequest
             * 사용자가 댓글 등록을 누르면 서버로 요청
             */

            var address = cookers_config.url;
            var reply = {};
            reply.addreplyHttpRequest = function(reply_object){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/addreply",
                    /*url: "http://localhost:3000/rest/cooks/cookSteps/addreply",*/
                    method: 'POST',
                    data: reply_object
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return reply;
        }])
    .factory('getreplyinitialdataService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function initialreplydataHttpRequest
             * 초기 해당 cook에 대한 댓글 데이터를 가져옴
             */

            var address = cookers_config.url;
            var reply = {};
            reply.initialreplydataHttpRequest = function(request_data){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/initialreply",
                    /*url: "http://localhost:3000/rest/cooks/cookSteps/initialreply",*/
                    method: 'POST',
                    data: request_data
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return reply;
        }])
    .factory('getcookeridService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function initialreplydataHttpRequest
             * 초기 해당 cook에 대한 댓글 데이터를 가져옴
             */

            var address = cookers_config.url;
            var get_obj = {};
            get_obj.getcookeridbyNicknameHttpRequest = function(nick_name){
                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/getcookerid/"+nick_name,
                    method: 'POST'
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return get_obj;
        }])
    .factory('deletereplyService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function initialreplydataHttpRequest
             * 초기 해당 cook에 대한 댓글 데이터를 가져옴
             */

            var address = cookers_config.url;
            var delete_obj = {};
            delete_obj.deletereplyHttpRequest = function(reply_id, reply_cookers_id){
                var temp = {};
                temp._id = reply_id;
                temp.reply_cookers_id = reply_cookers_id;

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks/cookSteps/deletereply",
                    method: 'POST',
                    data : temp
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return delete_obj;
        }]);