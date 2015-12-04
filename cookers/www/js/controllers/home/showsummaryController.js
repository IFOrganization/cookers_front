/**
 * Created by kimsungwoo on 2015. 11. 11..
 */
angular.module('cookers.controllers')
    .controller('showsummaryCtrl',[
        '$scope',
        '$ionicSlideBoxDelegate',
        'cookmodelManage',
        function($scope, $ionicSlideBoxDelegate, cookmodelManage) {

            var cook_model = cookmodelManage.get_cookmodel();
            $scope.summary_images = [];
            var step={};

            /**
             * $scope.summary_images --> step 요약 배열
             * 완성사진을 0번째로 삽입하고
             * step의 순서대로 차례차례 push
             */

            var first_step = {};
            first_step.num = 0;
            first_step.image = cook_model.complete_photo;

            $scope.summary_images.push(first_step);

            for(var i=1; i <= cook_model.steps.length; i++){
                step.num = i;
                step.image = cook_model.steps[i-1].photo;

                $scope.summary_images.push(step);

                step = {};
            }

            $scope.gotoslide = function(param){
                $ionicSlideBoxDelegate.slide(param);
                $scope.showsummarymodal.hide();

            }

            $scope.closeModal = function() {
                $scope.showsummarymodal.hide();
            };
        }]);
