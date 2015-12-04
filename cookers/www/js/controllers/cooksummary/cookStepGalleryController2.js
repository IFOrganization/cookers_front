angular.module('cookers.controllers')
    .controller('cookStepGalleryCtrl2',[
        '$scope',
        'cookSummaryService',
        '$ionicScrollDelegate',
        '$state',
        '$ionicLoading',
        '$timeout',
        function($scope, cookSummaryService, $ionicScrollDelegate, $state, $ionicLoading, $timeout){
            console.log("hello, cookStep2");
            $scope.plus_button_condition = false;
            $scope.modifyCondition = false;
            $scope.cook = cookSummaryService.getCook();

            $scope.addCookSummary = function(){
                cookSummaryService.addSummary()
                //$timeout(, 1000);
                //var str = '#ani'+ ($scope.cook.summary.length-2);
                //console.log(str);
                ////$(str).addClass('animated fadeInDown');

                $ionicScrollDelegate.scrollBottom(true);

                if($scope.cook.summary.length ==12){
                    $scope.plus_button_condition = true;
                }
            }

            /**
             * toggle $scope.modifyCondition.
             */
            $scope.cookSummaryModify = function(){
                $scope.modifyCondition = !$scope.modifyCondition;
            }

            /**
             * $scope.modifyCondition : true 일 때만 동작.
             * step 삭제.
             * @param index
             */
            $scope.deleteStep = function(index){

                if(!$scope.modifyCondition) return;
                if($scope.cook.summary.length < 12){
                    $scope.plus_button_condition = false;
                }
                console.log("delete : " + index+"//"+ $scope.plus_button_condition);
                if(cookSummaryService.removeSummary(index)==2){
                    $scope.modifyCondition = false;
                };

            }

            /**
             *  $scope.modifyCondition : true 일 때만 동작.
             *  $state 이동.
             * @param index
             */
            $scope.selectStep = function(index){
                if($scope.modifyCondition) return;
                console.log("select : " + index +" go to detail page");
                if(index ==0 ){
                    $state.go("tabs.cooksummary");
                }else{
                    $state.go("tabs.inputDetailStep",{index:index});
                }
            }

            /**
             * 입력 완료를 위한 버튼
             * 완료 버튼누를 시, cook에 대한 정보를 Server로 이동하기 전에
             * 유효성 검사에 대한 로직.
             */
            $scope.cookSumarryComplete = function(){
                if(!cookSummaryService.validationCheck()){

                    cookSummaryService.setHttpCook();

                    console.log(cookSummaryService.getHttpCook());
                    if($scope.cook.update_flag) {
                        /**
                         * cook update.
                         */
                        if(cookSummaryService.compareOriginHttpCook()){
                            /**
                             * 변동사항 있을 경우 이리로 들어오게 된다.
                             */
                            console.log(cookSummaryService.getHttptEditCook());
                            if(cookSummaryService.getHttptEditCook().steps != undefined){
                                cookSummaryService.addOriginPhotoNameInHttpEditCook();
                            }
                            cookSummaryService.submitEditCook().then(function(result){

                                /**
                                 * removes : 지울파일 이름
                                 * skips : 넘어갈 파일 index
                                 */

                                cookSummaryService.submitEditPhoto(result.current_steps_id, result.removes, result.skips).then(function(result){
                                    console.log(result);
                                });
                            });
                        }

                        $state.go("tabs.user",{userid : cookSummaryService.getHttpCook().w_cooker});

                    }else{
                        /**
                         * cook register.
                         */
                        cookSummaryService.submitCook().then(function(result){
                            console.log(result);
                            if(result.state == 200) {
                                var return_cook = result;
                                cookSummaryService.submitPhoto(return_cook._id, return_cook.steps).then(function(result){
                                    console.log(result);
                                    if(result.state == 200){
                                        $ionicLoading.show({
                                            showBackdrop: true,
                                            showDelay: 0,
                                            template : '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                                        });

                                        $state.go("tabs.home");

                                    }else{
                                        cookSummaryService.submitFail(return_cook._id, return_cook.yummy, return_cook.reply).then(function(){
                                            $ionicLoading.show({
                                                showBackdrop: true,
                                                showDelay: 2000,
                                                template : '네트워크가 불안정합니다.'
                                            });
                                        });
                                    }
                                });
                            }else{
                                cookSummaryService.submitFail(return_cook._id, return_cook.yummy, return_cook.reply).then(function(){
                                    $ionicLoading.show({
                                        showBackdrop: true,
                                        showDelay: 2000,
                                        template : '네트워크가 불안정합니다.'
                                    });
                                });
                            }
                            $timeout(function () {
                                $ionicLoading.hide();
                            }, 2000);
                        });
                    }


                }
            }
        }
    ]);
