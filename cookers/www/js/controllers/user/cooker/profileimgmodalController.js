angular.module('cookers.controllers')
    .controller('profileimgmodalController', [
        '$scope',
        'userinfoService',
        function ($scope,userinfoService) {
            console.log(userinfoService.getuserInfo());

            $scope.cooker_profile = userinfoService.getuserInfo().cooker_profile;

            if($scope.cooker_profile.cooker_photo == ''){
                $scope.imgdata = 'img/chef31.png';
            }else{
                $scope.imgdata = $scope.cooker_profile.cooker_photo;
            }

            $scope.imgclose = function(){
                $scope.$emit('profileimg_modal_close');
            }
        }
    ]);