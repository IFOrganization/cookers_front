/**
 * Created by kimsungwoo on 2015. 10. 30..
 */
angular.module('cookers.controllers')
    .controller('searchresulttagCtrl',[
        '$scope',
        '$ionicModal',
        '$ionicLoading',
        '$timeout',
        '$ionicSlideBoxDelegate',
        '$state',
        'searchresultlist',
        'tagkeywordService',
        'currentinfoService',
        function($scope, $ionicModal, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $state, searchresultlist, tagkeywordService, currentinfoService) {
            $scope.tag_keyword = tagkeywordService.get_tagKeyword();
            $scope.cook_list = searchresultlist;
            $scope.result_check = false;

            if($scope.cook_list.length == 0){
                $scope.result_check = true;
            }

            $scope.gotoshowcookingTemplate = function(cook_id){
                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>'
                });

                $state.go('tabs.showcook',{cook_id:cook_id});

                $timeout(function () {
                    $ionicLoading.hide();

                }, 1000);
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };
        }
    ]);
