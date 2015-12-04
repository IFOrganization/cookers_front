/**
 * Created by kimsungwoo on 2015. 10. 6..
 */
angular.module('cookers.controllers')
    .controller('homeCtrl',[
        '$scope',
        '$ionicModal',
        '$ionicSlideBoxDelegate',
        '$ionicLoading',
        '$timeout',
        'cooksService',
        'userinfoService',
        'currentinfoService',
        function($scope, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, $timeout, cooksService,
                 userinfoService, currentinfoService) {

            $scope.cook_count = 5;
            $scope.moreDataCanBeLoaded = true;
            $scope.cook_list = [];

            $scope.$on('getprofileComplete',function(event, args){
                cooksService.getcooksList(userinfoService.getuserInfo().cooker_profile.following, userinfoService.getuserInfo().cooker_profile._id).then(function(data){
                    $scope.cook_list = data;
                });
            });

            /**
             * 모달 open. 현재는 한개의 레시피만 열리지만, 추후 파라미터값(레시피 id와 같은)을 전송하여 해당 레시피의 상세 를 볼 수 있게함.
             */
            $scope.openshowrecipeModal = function(cook_id){
                /**
                 * 모달 초기화 함수.
                 * 모달의 경우 app.js 내의 state로서 정의할 수 없다.
                 */

                /**
                 * 아래의 서비스를 통해 cook_id를 유지시키고 서버로부터 해당 cook정보를 가져온다.
                 */
                currentinfoService.set_currentcook_id(cook_id);

                $ionicModal.fromTemplateUrl('views/home/showcookingmodalTemplate.html', {
                    scope: $scope,
                    animation: 'mh-slide'
                }).then(function(modal) {
                    $scope.showcookingmodal = modal;
                });

                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    /*template : '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'*/
                    template : '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>'
                });

                $timeout(function () {
                    $ionicLoading.hide();

                    $ionicSlideBoxDelegate.slide(0);
                    $scope.showcookingmodal.show();
                }, 1000);
            };

            $scope.closeModal = function() {
                $scope.showcookingmodal.hide();
            };

            /**
             * 당겨서 새로고침 함수
             */
            $scope.refreshcookList = function(){
                cooksService.getcooksList(userinfoService.getuserInfo().cooker_profile.following, userinfoService.getuserInfo().cooker_profile._id).then(function (data) {
                    $scope.cook_list = data;
                    $scope.$broadcast('scroll.refreshComplete');

                });
            }

            /**
             * 무한 스크롤 함수
             */
            $scope.loadmorecookList = function(){

                if($scope.cook_list.length != 0 && ($scope.cook_list.length < $scope.cook_count)){
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.cook_count = $scope.cook_count*1 + 5;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            /*$scope.$on('$stateChangeSuccess', function() {
                $scope.loadmorecookList();
            });*/

            $scope.$on('close_showcookingmodal',function(event, args){
                $scope.showcookingmodal.hide();
            })
        }]);
