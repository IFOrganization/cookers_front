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
        'searchresultlist',
        'tagkeywordService',
        'currentinfoService',
        function($scope, $ionicModal, $ionicLoading, $timeout, $ionicSlideBoxDelegate,  searchresultlist, tagkeywordService, currentinfoService) {
            $scope.tag_keyword = tagkeywordService.get_tagKeyword();
            $scope.cook_list = searchresultlist;
            $scope.result_check = false;

            console.log($scope.cook_list);

            if($scope.cook_list.length == 0){
                $scope.result_check = true;
            }

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
                    $scope.modal = modal;
                });

                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                });

                $timeout(function () {
                    $ionicLoading.hide();

                    $ionicSlideBoxDelegate.slide(0);
                    $scope.modal.show();
                }, 1000);
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };
        }
    ]);
