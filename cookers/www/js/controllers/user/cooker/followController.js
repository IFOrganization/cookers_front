/**
 * Created by airnold on 15. 10. 24..
 */

angular.module('cookers.controllers')
    .controller('followController', [
        '$scope',
        '$state',
        'cookerfollow',
        '$ionicPopup',
        'cookerService',
        '$localStorage',
        '$ionicHistory',
        function ($scope, $state, cookerfollow,$ionicPopup,cookerService, $localStorage,$ionicHistory) {
            $scope.list_swipe = true;

            $scope.cooker_follow_list = cookerfollow.following;


            if($localStorage.id == cookerfollow._id){
                $scope.cancelbtn_user = true;
            }else{
                $scope.cancelbtn_user = false;
            }


            $scope.cookerInfoEvent = function (follow_id) {
                $state.go('tabs.user', {userid: follow_id});
            };
            $scope.removeFollow = function (remove_id) {

                var confirmPopup = $ionicPopup.confirm({
                    title: '한번더 확인!',
                    template: '<h5 style="color:red;"> 팔로우를 끊으시겠습니까 ?</h5>'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        /**
                         * 팔로우 끊는 로직 !
                         * 배열에서 삭제하고 서버에서도 삭제 !
                         */
                        cookerService.cancelFollowerHttpRequest($localStorage.id, remove_id).then(function(boolean_value){
                            console.log(boolean_value);
                            if(boolean_value == true){
                                $scope.cooker_follow_list = cookerService.removeFollowList($scope.cooker_follow_list, remove_id);
                            }else{
                                alert('오류남');
                            }
                        });

                    } else {
                        /**
                         * 팔로우 끊지 않는 로직 !
                         */
                    }
                });
            };
            $scope.gotoProfile = function () {
                /*$state.go('tabs.user', {userid: cookerfollow._id})*/
                var backView = $ionicHistory.backView();
                backView.go();
            }
        }
    ]);
