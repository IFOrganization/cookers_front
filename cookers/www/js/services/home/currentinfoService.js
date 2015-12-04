/**
 * Created by kimsungwoo on 2015. 10. 14..
 *
 * currentinfoService는 사용자가 선택한 정보(쿡_id, 유저id 등등)를
 * 싱글톤으로 유지하는 서비스이다.
 */
angular.module('cookers.services')
    .factory('currentinfoService',[function(){
        var currentcook_id = undefined;
        return {
            set_currentcook_id : function(cook_id){
                currentcook_id = cook_id;
            },
            get_currentcook_id : function(){
                return currentcook_id;
            }
        }
    }]);
