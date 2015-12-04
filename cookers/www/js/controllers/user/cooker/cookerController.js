/**
 * Created by airnold on 15. 10. 16..
 */


angular.module('cookers.controllers')
    .controller('cookerController',[
        '$scope',
        '$localStorage',
        'userStatus',
        'cookerinfoService',
        'cookerService',
        '$state',
        '$rootScope',
        '$window',
        '$ionicHistory',
        'currentinfoService',
        '$ionicModal',
        '$ionicLoading',
        '$timeout',
        '$ionicSlideBoxDelegate',
        'cookSummaryService',
        function($scope, $localStorage, userStatus, cookerinfoService,cookerService,$state,$rootScope,$window,$ionicHistory,currentinfoService,$ionicModal,$ionicLoading,$timeout,$ionicSlideBoxDelegate, cookSummaryService){

            $scope.checkuserinfo_intag = userStatus.check_userinfo;
            $scope.check_myuserinfo_intag = userStatus.check_myuserinfo;

            if(!userStatus.check_userinfo){
                $scope.cooker_profile = cookerinfoService.getcookerInfo();
                $scope.cooker_zimmy = cookerinfoService.getcookerZimmy();
                $scope.cooker_mycook = cookerinfoService.getcookerMycook();

                console.log($scope.cooker_mycook);
                console.log($scope.cooker_zimmy);

                $scope.active = 'mine';

                /**
                 * userStatus.check_myuserinfo => false -> 다른 유저 보기
                 * userStatus.check_myuserinfo => true -> 같은 유저 보기
                 */

                $scope.cooker_state_comment = $scope.cooker_profile.state_comment;

                if($scope.cooker_profile.cooker_photo == ''){
                    $scope.imgdata = 'img/chef31.png';
                }else{
                    $scope.imgdata = $scope.cooker_profile.cooker_photo;
                }

                /**
                 * $scope.follow_status 로 팔로우끊기와 팔로우하기 로직때 사용
                 */
                $scope.follow_status = cookerinfoService.followerStatus($localStorage.id);
                $scope.profile_btn = '';
                if(userStatus.check_myuserinfo == true){
                    $scope.profile_btn = '정보수정';
                }else{
                    if($scope.follow_status == true){
                        /**
                         * 다른유저의 프로필을 보고 있는 상황에서 팔로우중
                         */
                        $scope.follow_status_class = "button-balanced";
                        $scope.profile_btn = '팔로우끊기';
                    }else{
                        /**
                         * 다른유저의 프로필을 보고 있는 상황에서 팔로우중이지 않음
                         */
                        $scope.follow_status_class = "button-assertive";
                        $scope.profile_btn = '팔로우하기';
                    }
                }

                /*$scope.mycook_zimmy = 'mycook';

                 $scope.mycookEvent = function(){

                 $scope.mycook_zimmy = 'mycook';

                 };
                 $scope.zimmyEvent = function(){
                 $scope.mycook_zimmy = 'zimmy';
                 };*/



                $scope.cooker_zimmy_count = 3;
                $scope.cooker_mycook_count = 3;
                $scope.loadmoreCookEvent = function(){

                    $scope.cooker_zimmy_count = $scope.cooker_zimmy_count*1 + 2;
                    $scope.cooker_mycook_count = $scope.cooker_mycook_count*1 + 2;

                    $timeout(function() {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, 1250);
                };

                $scope.profileBtnEvent = function(){
                    if(userStatus.check_myuserinfo == true){
                        /**
                         * 정보수정
                         */
                        $state.go('tabs.edit',{userid:$localStorage.id});

                    }else{
                        if($scope.follow_status == true){
                            /**
                             * 다른유저의 프로필을 보고 있는 상황에서 팔로우중
                             */
                            cookerService.cancelFollowerHttpRequest($localStorage.id, $scope.cooker_profile._id).then(function(data){
                                $scope.follow_status_class = "button-assertive";
                                $state.go($state.current, {userid : $scope.cooker_profile._id}, {reload: true});

                            })

                        }else{
                            /**
                             * 다른유저의 프로필을 보고 있는 상황에서 팔로우중이지 않음
                             * 로컬스토리지 -> 현재 다른 유저를 보고있는 해당 앱 유저의 id
                             * $scope.cookr_profile._id -> 팔로우 당할 쿠커의 아이디
                             */
                            cookerService.makeFollowerHttpRequest($localStorage.id,$localStorage.nick_name,$localStorage.cooker_photo,$scope.cooker_profile._id, $scope.cooker_profile.nick_name, $scope.cooker_profile.cooker_photo).then(function(follow_status){
                                $scope.follow_status_class = "button-balanced";
                                $state.go($state.current, {userid : $scope.cooker_profile._id}, {reload: true});

                            })
                        }
                    }
                };

                $scope.followEvent = function(){
                    $state.go('tabs.follow',{userid : $scope.cooker_profile._id});
                };
                $scope.followerEvent = function(){
                    $state.go('tabs.follower',{userid : $scope.cooker_profile._id});
                };

                $scope.back_view_go = function(){
                    var backView = $ionicHistory.backView();
                    backView.go();
                };

                $scope.profile_img_zoom = function(){

                    $ionicModal.fromTemplateUrl('views/user/profileimg_modal.html', {
                        scope: $scope,
                        animation: 'mh-slide'
                    }).then(function(modal) {
                        $scope.profileimgmodal = modal;
                        $scope.profileimgmodal.show();
                    });

                };
                $scope.$on('profileimg_modal_close', function(){
                    $scope.profileimgmodal.hide();
                });

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

                $scope.edit = function(selected_cook){
                    console.log(selected_cook);
                    var steps = [];

                    steps.push({
                        title : selected_cook.title,
                        desc : selected_cook.desc,
                        input_stuff : '',
                        stuffs : selected_cook.stuffs,
                        input_tag :'',
                        tags : selected_cook.tags,
                        photo : 'img/cooksummary.png',
                    });
                    for(var i in selected_cook.steps){
                        steps.push(selected_cook.steps[i]);
                    }
                    steps.push({
                        plus_button : true
                    });
                    var edit_cook = {
                        _id : selected_cook._id,
                        summary : steps,
                        update_flag : true
                    }

                    cookSummaryService.setCook(edit_cook);
                    cookSummaryService.setOriginCook();
                    $state.go('tabs.cooksummary');
                };

                $scope.setActive = function(getType) {
                    $scope.active = getType;
                };

                $scope.isActive = function(type) {
                    return type === $scope.active;
                };

                $scope.$on('close_showcookingmodal',function(event, args){
                    $scope.modal.hide();
                });

            } else {
                $scope.imgdata = "img/chef31.png";
                $scope.profile_btn = '사용자 정보 없음';
            }
        }
    ]);
