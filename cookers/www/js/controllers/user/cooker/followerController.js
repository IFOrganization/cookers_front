/**
 * Created by airnold on 15. 10. 24..
 */

angular.module('cookers.controllers')
    .controller('followerController', [
        '$scope',
        'cookerfollower',
        '$state',
        '$ionicHistory',
        function ($scope,cookerfollower,$state,$ionicHistory) {
            $scope.list_swipe = true;


            $scope.cooker_follower_list = cookerfollower.followers;

            $scope.cookerInfoEvent = function(follow_id){
                $state.go('tabs.user', {userid : follow_id});
            };

            $scope.gotoProfile = function(){
                /* $state.go('tabs.user', {userid : cookerfollower._id})*/
                var backView = $ionicHistory.backView();
                backView.go();
            };
        }
    ]);
