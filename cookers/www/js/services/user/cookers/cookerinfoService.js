/**
 * Created by airnold on 15. 10. 16..
 */


/**
 * Created by airnold on 15. 10. 12..
 */


angular.module('cookers.services')
    .factory('cookerinfoService',[
        '$http',
        '$q',
        function($http, $q) {

            var cookerInfo = {};
            var profile = {};
            var zimmy = {};
            var mycook = {};

            cookerInfo.getcookerInfo = function(){
                return profile
            };
            cookerInfo.setcookerInfo = function(cooker_profile){

                console.log(cooker_profile);

                profile = cooker_profile;
            };

            cookerInfo.getcookerZimmy = function(){
                return zimmy;
            };
            cookerInfo.setcookerZimmy = function(cooker_zimmy){

                zimmy = cooker_zimmy;
            };

            cookerInfo.getcookerMycook = function(){
                return mycook;
            };
            cookerInfo.setcookerMycook = function(cooker_mycook){

                mycook = cooker_mycook;
            };

            cookerInfo.followerStatus = function(local_id){
                var follower_list = profile.followers;
                var follower_status = false;

                for(var i in follower_list){
                    if(follower_list[i]._id == local_id){
                        follower_status = true;
                    }
                }

                return follower_status;

            };

            return cookerInfo;
        }]);
