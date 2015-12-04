angular.module('cookers.controllers')
    .controller('inputDetailStepCtrl',[
        '$scope',
        '$state',
        '$stateParams',
        'cookSummaryService',
        'cameraService',
        '$ionicModal',
        function($scope, $state, $stateParams, cookSummaryService, cameraService, $ionicModal){
        //function($scope, $state, $stateParams, cookSummaryService, $ionicModal){
            $scope.index = parseInt($stateParams.index);
            $scope.step = cookSummaryService.getSummary($scope.index);


            if($scope.step == undefined || $scope.step.plus_button){
                $state.go('tabs.cookStepGallery');
            }

            $scope.clickBackBtn = function(){
                console.log("click back button");
                $state.go('tabs.cookStepGallery');
            }

            $scope.stepInputComplete = function(){
                console.log("complete");
                console.log(cookSummaryService.getCook());
                $state.go('tabs.cookStepGallery');
            }



            /**
             *  Camera Service
             *  1   : Camera
             *  !1  : Album
             */

            $scope.getAlbum = function(){
                cameraService.optionSetting(0);

                cameraService.getPicture().then(call_back);
            }

            $scope.getCamera = function(){
                //$scope.openModal();
                cameraService.optionSetting(1);

                cameraService.getPicture().then(call_back);
            }

            var call_back = function(base64_data){
                $scope.step.photo = "data:image/jpg;base64," + base64_data;

                if(ionic.Platform.isIOS()){
                    $scope.drawCanvas();
                }else{
                    $scope.openModal();
                }
            }

            /**
             * Ionic Modal...
             */
            $scope.selectedPhotoData = $scope.step.photo;
            $scope.modal = {};
            $scope.modalPreBtnClick = function(){
                console.log("modal pre");
                $scope.modal.hide();
            };

            $scope.modalCompleteBtnClick = function(){
                console.log("modal complete");
                $scope.drawCanvas();
                $scope.modal.hide();
            };

            $scope.openModal = function(){
                $scope.selectedPhotoData = $scope.step.photo;

                $ionicModal.fromTemplateUrl('views/cooksummary/photoResizeModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    console.log("define modal");
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            /**
             *  Draw Canvas Image
             */

            $scope.drawCanvas = function(){

                var canvas = document.getElementById("drawImage");
                canvas.width = canvas.height = canvas.scrollWidth;
                var ctx = canvas.getContext("2d");
                var image =  new Image();
                image.src = $scope.step.photo;

                image.onload = function(){
                    console.log("load");
                    ctx.clearRect(0,0,canvas.width, canvas.height);

                    if(image.width > image.height){
                        var height = canvas.height * (image.height / image.width);
                        ctx.drawImage(image, 0, (canvas.height - height) / 2, canvas.width, height);
                    }else{
                        var width = canvas.width * (image.width / image.height);
                        ctx.drawImage(image, (canvas.width - width) / 2 ,0, width, canvas.height);
                    }

                    $scope.step.photo = canvas.toDataURL();
                }
            }
            $scope.drawCanvas();
        }
    ])
