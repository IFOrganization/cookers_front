/**
 * Created by airnold on 15. 10. 16..
 */
//getcookerProfileHttpRequest


angular.module('cookers.services')
    .factory('cookerService', [
        '$http',
        '$q',
        'cookers_config',
        function ($http, $q,cookers_config) {
            var cooker_service = {};
            var address = cookers_config.url;

            cooker_service.getcookerProfileHttpRequest = function (userid) {
                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooker/profile?userid="+userid,
                    method : 'get'
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };

            cooker_service.makeFollowerHttpRequest = function(follower_id,follower_nickname,follower_photo, follow_id, follow_nickname, follow_photo){
                var defer = $q.defer();

                var json_data = {};
                json_data.follower_id = follower_id;
                json_data.follower_nickname = follower_nickname;
                json_data.follower_photo = follower_photo;
                json_data.follow_id = follow_id;
                json_data.follow_nickname = follow_nickname;
                json_data.follow_photo = follow_photo;


                $http({
                    url:address+"/rest/cooker/makefollow",
                    method : 'post',
                    data : {'data' : json_data}
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };
            cooker_service.cancelFollowerHttpRequest = function(follower_id,follow_id){
                var defer = $q.defer();

                var json_data = {};
                json_data.follower_id = follower_id;
                json_data.follow_id = follow_id;


                $http({
                    url:address+"/rest/cooker/cancelfollow",
                    method : 'post',
                    data : {'data' : json_data}
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };

            cooker_service.editProfileHttpRequest = function(edit_data, id){
                var defer = $q.defer();
                /**
                 * photo 는 패스만을 가지고 있음 id + .png로
                 * 실제 이미지 데이터는 imgdata에서 처리
                 * @type {{}}
                 */

                var json_data = {};
                json_data.cooker_id = id;
                json_data.name = edit_data.name;
                json_data.state_comment = edit_data.state_comment;
                json_data.photo = edit_data.photo;
                json_data.pw = edit_data.change_pw;

                $http({
                    url:address+"/rest/cooker/editprofile",
                    method : 'post',
                    data : {'data' : json_data}
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };

            cooker_service.uploadProfileImageHttpRequest = function(user_id, imgdata){
                var defer = $q.defer();

                $http({
                    url:address+"/rest/photo/upload/user/"+user_id,
                    method : 'post',
                    data : {'data' : imgdata}
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };


            cooker_service.removeFollowList = function(array, removeid){
                for(var i in array){
                    if(array[i]._id == removeid){
                        array.splice(i, 1);
                    }
                }
                return array;
            };

            cooker_service.checkPwHttpRequest = function(id, pw){
                var defer = $q.defer();

                var json_data = {};
                json_data.id = id;
                json_data.pw = pw;

                $http({
                    url:address+"/rest/cooker/changepwcheck",
                    method : 'post',
                    data : {'data' : json_data}
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };

            return cooker_service;

        }]);
