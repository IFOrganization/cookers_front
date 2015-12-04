/**
 * Created by kimsungwoo on 2015. 10. 11..
 */
angular.module('cookers.services')
    .factory('cooksService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {
            /**
             * function getcookslist ()
             * 홈에서 팔로우 한 사람들의 레시피들을 가져옴.
             */

            var address = cookers_config.url;
            var cooksList = {};
            cooksList.getcooksList = function(following_list, my_id){

                /**
                 * 내 _id를 먼저 push
                 * 그 다음 나의 팔로잉 리스트를 push
                 */
                var temp = [];

                temp.push(my_id);

                for(var i in following_list){
                    temp.push(following_list[i]._id);
                }

                var defer = $q.defer();
                $http({
                    url:address+"/rest/cooks",
                    method: 'POST',
                    data: temp
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return cooksList;
        }])
    .factory('cookmodelManage',[function(){
        var cook = undefined;
        return {
            set_cookmodel : function(model_item){
                cook = model_item;
            },
            get_cookmodel : function(){
                return cook;
            }
        }
    }]);
