/**
 * Created by airnold on 15. 10. 12..
 */


angular.module('cookers.services')
    .factory('userinfoService',[
        '$http',
        '$q',
        function($http, $q) {
            /**
             * 이미 인증(로그인, 회원가입)이 완료된 사용자의 정보를
             * localStorage에서 가져옴
             * (자성이 소스부분 완성되면 의존성과 localStroage에서 정보 추출하는 코드 추가할 것)
             */

            var userInfo = {};
            var profile = {};
            userInfo.getuserInfo = function(){
                return profile;
            };

            userInfo.setuserInfo = function(user_profile){
                profile = user_profile;
            };

            return userInfo;
        }]);

