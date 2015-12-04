angular.module('cookers.controllers')
    .controller('noticeCtrl', [
        '$scope',
        '$state',
        'noticeService',
        '$ionicModal',
        '$ionicSlideBoxDelegate',
        '$ionicLoading',
        'currentinfoService',
        '$timeout',
        function($scope, $state, noticeService, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, currentinfoService, $timeout){
            /**
             * After Sign In,, Server에 message push....
             * getting Notice message..
             * ---> noticeService Creating... and  get message that group by noticeCode...
             *
             */
            $scope.notices = noticeService.getNotices();
            $scope.$on('notice_reset',function(){
                $scope.notices = noticeService.getNotices();
            });


            /**
             * check button click Method
             */
            $scope.checkBtnClick = function(selected_notice, index) {
                console.log(selected_notice);
                var code = selected_notice.kind_code;
                if (code == "FM") {
                    console.log("goto user");
                    $state.go("tabs.user", {userid: selected_notice.from._id});

                } else {
                    console.log("cook modal open");
                    $scope.openshowrecipeModal(selected_notice.cook._id, index);
                }
                //noticeService.updateStateCodeHttpRequest(selected_notice._id).then(function (result) {
                //
                //    if (result.state == 200) {
                //        if (code == "FM") {
                //            console.log("goto user");
                //            $state.go("tabs.user", {userid: selected_notice.from._id});
                //
                //        } else {
                //            console.log("cook modal open");
                //            $scope.openshowrecipeModal(selected_notice.cook._id, index);
                //        }
                //    } else {
                //        $ionicLoading.show({
                //            showBackdrop: true,
                //            showDelay: 0,
                //            template : '문제가 발생하여 홈화면으로 돌아갑니다.'
                //        });
                //        $timeout(function () {
                //            $ionicLoading.hide();
                //        }, 2000);
                //        $state.go("tabs.home");
                //    }
                //});
            }

            /**
             * 모달 open. 현재는 한개의 레시피만 열리지만, 추후 파라미터값(레시피 id와 같은)을 전송하여 해당 레시피의 상세 를 볼 수 있게함.
             */
            $scope.openshowrecipeModal = function(cook_id, index){
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

                    /**
                     * list에서 해당 항목 삭제
                     */
                    noticeService.removeNotice(index);
                }, 1000);

            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };
        }
    ]);
