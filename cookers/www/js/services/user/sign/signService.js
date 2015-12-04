/**
 * Created by airnold on 15. 10. 9..
 */


angular.module('cookers.services')
    .factory('signService', [
        '$http',
        '$q',
        'cookers_config',
        function ($http, $q,cookers_config) {
            var user_sign_service = {};
            var address = cookers_config.url;

            user_sign_service.signCheckEmailRequest = function(email,what){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/idcheck?email="+email+"&what="+what,
                    method : 'get'
                }).success(function(data,status,headers, config){

                    defer.resolve(data);

                }).error(function(data, status, headers, config){

                    console.log(data);

                });
                return defer.promise;
            };


            user_sign_service.signupHttpRequest = function (signup_data) {

                var signup_json = {};

                signup_json.email = signup_data.signup_email;
                signup_json.nickname = signup_data.signup_nickname;
                signup_json.pw = signup_data.signup_pw;
                signup_json.name = signup_data.signup_name;
                signup_json.subemail = signup_data.signup_subemail;



                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/signup",
                    method : 'post',
                    data : {'data' : signup_json}
                }).success(function(data,status,headers, config){
                    defer.resolve(data);
                }).error(function(data, status, headers, config){
                    $window.alert(data);
                });

                return defer.promise;

            };

            user_sign_service.signinhttpRequest = function (signin_data) {

                var signin_json = {};
                signin_json.email = signin_data.signin_email;
                signin_json.pw = signin_data.signin_pw;

                /**
                 * this function request to node server for getting user sign id or passwd
                 * compare sign data between db data and user input id passwd
                 * finally, setting sign status and save to local storage
                 */

                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/signin",
                    method : 'post',
                    data : {'data' : signin_json}
                }).success(function(data,status,headers, config){
                    defer.resolve(data);
                }).error(function(data, status, headers, config){
                    $window.alert(data);
                });
                return defer.promise;
            };


            user_sign_service.findEmailHttpRequest = function (find_data) {
                var find_json = {};
                find_json.subemail = find_data.find_subemail;
                find_json.name = find_data.find_name;


                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/findemail",
                    method : 'post',
                    data : {'data' : find_json}
                }).success(function(data,status,headers, config){
                    defer.resolve(data);
                }).error(function(data, status, headers, config){
                    $window.alert(data);
                });
                return defer.promise;
            };

            user_sign_service.findPasswordHttpRequest = function (find_data) {
                var find_json = {};
                find_json.email = find_data.find_email;

                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/findpw",
                    method : 'post',
                    data : {'data' : find_json}
                }).success(function(data,status,headers, config){
                    defer.resolve(data);
                }).error(function(data, status, headers, config){
                    $window.alert(data);
                });
                return defer.promise;
            };

            user_sign_service.checkNicknameHttpRequest = function(nickname){
                var find_json = {};
                find_json.nick_name = nickname;

                var defer = $q.defer();
                $http({
                    url:address+"/rest/sign/checknickname",
                    method : 'post',
                    data : {'data' : find_json}
                }).success(function(data,status,headers, config){
                    defer.resolve(data);
                }).error(function(data, status, headers, config){
                    $window.alert(data);
                });
                return defer.promise;
            };

            return user_sign_service;

        }]);
