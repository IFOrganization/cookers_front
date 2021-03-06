/**
 * Created by kimsungwoo on 2015. 10. 6..
 */
angular.module('cookers.controllers')
    .controller('showcookingmodalCtrl',[
        '$scope',
        '$ionicModal',
        '$ionicLoading',
        '$timeout',
        '$state',
        '$cordovaSocialSharing',
        '$ionicHistory',
        'userinfoService',
        'yummyService',
        'zimmyService',
        'cookmodelManage',
        'checkmyyummyService',
        'checkmyzimmyService',
        'tagkeywordService',
        'insertnoticeService',
        'inchitService',
        'getcookstepList',
        function($scope, $ionicModal, $ionicLoading, $timeout, $state, $cordovaSocialSharing, $ionicHistory,
                 userinfoService, yummyService, zimmyService, cookmodelManage, checkmyyummyService, checkmyzimmyService,
                 tagkeywordService, insertnoticeService, inchitService, getcookstepList) {

            $scope.current_cook = getcookstepList[0];
            $scope.cook_id = $scope.current_cook._id;
            $scope.myProfile = userinfoService.getuserInfo().cooker_profile;
            $scope.yummy_count = $scope.current_cook.yummy.cookers.length;
            $scope.reply_count = $scope.current_cook.reply.cookers.length;

            var check_yummy_data = {};
            var check_zimmy_data = {};
            $scope.is_zimmy = false;

            cookmodelManage.set_cookmodel($scope.current_cook);

            /**
             * 위에서 cookStep에 대한 데이터 바인딩 후
             * 해당 cook 조회수 증가
             */
            inchitService.increase_hit($scope.cook_id);

            console.log($scope.current_cook);

            /**
             * 쿡을 터치했을때 처음 yummy를 체크하는 부분
             * 유저정보에 있는 유저 _id와 yummy의 _id가 필요
             */
            check_yummy_data.cooker_yummy_id = $scope.myProfile.yummy;
            check_yummy_data.cook_id = $scope.cook_id;

            checkmyyummyService.checkyummyHttpRequest(check_yummy_data).then(function(data){
                $scope.yummy_check = data;
                console.log(data);
                console.log($scope.yummy_count);
            });


            /**
             * zimmy 체크 part
             */
            check_zimmy_data.cook_id = $scope.cook_id;
            check_zimmy_data.cooker_id = $scope.myProfile._id;

            checkmyzimmyService.checkzimmyHttpRequest(check_zimmy_data).then(function(data){
                $scope.is_zimmy = data;
            });


            $scope.yummyClicked = function(){

                var yummyData = {};
                yummyData.cook_yummy_id = $scope.current_cook.yummy._id;
                yummyData.cooker_yummy_id = $scope.myProfile.yummy;
                yummyData.cook_id = $scope.cook_id;
                yummyData.cooker_id = $scope.myProfile._id;
                yummyData.check_yummy = $scope.yummy_check;


                yummyService.yummydataHttpRequest(yummyData).then(function(){
                    /**
                     * - 위 서비스를 호출 하여 두개의 yummy document에 insert한 뒤
                     *   yummy 갯수를 가져옴.
                     *
                     * - 버튼의 활성화상태를 표시한 후
                     *   갯수 갱신
                     */

                    if($scope.yummy_check){
                        /**
                         * yummy 활성화 상태 --> 비활성화
                         */

                        $scope.yummy_check = false;
                        $scope.yummy_count = $scope.yummy_count*1 - 1;

                    } else {
                        /**
                            * yummy 비활성화 상태 --> 활성화
                        */

                        $scope.yummy_check = true;
                        $scope.yummy_count = $scope.yummy_count*1 + 1;

                        var notice = {};
                        notice.kind_code = "L";
                        notice.from = $scope.myProfile._id;
                        notice.to = $scope.current_cook.w_cooker._id;
                        notice.cook = $scope.current_cook._id;

                        insertnoticeService.noticeHttpRequest(notice);
                    }
                });

            }

            $scope.manageZimmy = function(){

                zimmyService.zimmydataHttpRequest(check_zimmy_data);

                if($scope.is_zimmy){
                    $scope.is_zimmy = false;
                    $ionicLoading.show({
                        showBackdrop: false,
                        template : 'ZIMMY 목록에서 삭제되었습니다'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                } else {
                    $scope.is_zimmy = true;
                    $ionicLoading.show({
                        showBackdrop: false,
                        template : 'ZIMMY 목록에 추가되었습니다'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 1500);
                }
            }

            $scope.addReply = function(){
                $state.go('tabs.showcookReply',
                    {
                        cook_id : $scope.current_cook._id,
                        reply_id : $scope.current_cook.reply._id
                    });
            }

            $scope.tag_clicked = function(tag_name){
                /**
                 * 태그를 검색 한 후 자동완성된 키워드를 터치하면
                 * 해당 키워드의 태그가 포함된 레시피 목록을 보여줌.
                 */

                tagkeywordService.set_tagKeyword(tag_name);
                $state.go('tabs.searchresult_Tag',{tag:tag_name});
            }


            $scope.show_summary = function(){
                /**
                 * change
                 */
                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                });

                $ionicModal.fromTemplateUrl('views/home/showsummaryTemplate.html', {
                    scope: $scope

                }).then(function(modal) {
                    $scope.showsummarymodal = modal;
                });

                $timeout(function () {
                    $ionicLoading.hide();

                    $scope.showsummarymodal.show();
                }, 1000);
            }

            $scope.share_social = function(){
                /**
                 * 추후 앱이 올라가면 다운로드 링크로 연결
                 */
                $cordovaSocialSharing.share('당신을 쿠커스로 초대합니다!!', '초대장', null, 'http://makeyourif.wordpress.com');
            }

            $scope.backtohome = function(){
                $ionicHistory.goBack();
            }
        }]);
