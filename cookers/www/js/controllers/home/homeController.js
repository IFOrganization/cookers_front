/**
 * Created by kimsungwoo on 2015. 10. 6..
 */
angular.module('cookers.controllers')
    .controller('homeCtrl',[
        '$scope',
        '$ionicSlideBoxDelegate',
        '$ionicLoading',
        '$timeout',
        '$state',
        'cooksService',
        'userinfoService',
        function($scope, $ionicSlideBoxDelegate, $ionicLoading, $timeout, $state, cooksService, userinfoService) {

            $scope.cook_count = 5;
            $scope.moreDataCanBeLoaded = true;
            $scope.cook_list = [];

            $scope.$on('getprofileComplete',function(event, args){
                cooksService.getcooksList(userinfoService.getuserInfo().cooker_profile.following, userinfoService.getuserInfo().cooker_profile._id).then(function(data){
                    $scope.cook_list = data;
                });
            });

            $scope.gotocook = function(getCook_id){

                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>'
                });

                $state.go('tabs.showcook',{cook_id:getCook_id});
                $timeout(function () {
                    $ionicLoading.hide();

                }, 1000);
            };

            /*$scope.closeModal = function() {
                $scope.showcookingmodal.hide();
            };*/

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

            /*$scope.$on('close_showcookingmodal',function(event, args){
                $scope.showcookingmodal.hide();
            })*/
        }]);
