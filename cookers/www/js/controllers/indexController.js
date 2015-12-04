/**
 * Created by airnold on 15. 10. 7..
 */


angular.module('cookers.controllers')
    .controller('indexController',[
        '$scope',
        '$ionicModal',
        '$localStorage',
        '$state',
        'cookSummaryService',
        'cookerService',
        'userinfoService',
        '$rootScope',
        'socket',
        function($scope, $ionicModal, $localStorage, $state, cookSummaryService, cookerService, userinfoService, $rootScope, socket){

            $scope.badgedata = '';

            socket.on('badgenoti', function(data){
                $scope.badgedata = data;
            });

            $scope.user_id = $localStorage.id;

            console.log($scope.user_id);

            $ionicModal.fromTemplateUrl('views/user/sign_modal.html', function($ionicModal) {
                $scope.signmodal = $ionicModal;

                if($localStorage.current_sign == false){
                    $scope.signmodal.show();
                }else{

                }

            }, {

                scope: $scope,
                animation: 'slide-in-up'

            });



            $scope.$on('closeModal', function(event,data){
                $scope.signmodal.hide();
                $scope.user_id = $localStorage.id;
            });

            $scope.$on('signoutEvent', function(event,data){

                $localStorage.name = '';
                $localStorage.nick_name = '';
                $localStorage.token = '';
                $localStorage.current_sign = false;
                $localStorage.id = '';
                $scope.signmodal.show();
            });

            $scope.userTabEvent = function(){
                $state.go('tabs.user',{userid : $scope.user_id});
            }

            $scope.goHome= function(){
                cookerService.getcookerProfileHttpRequest($localStorage.id).then(function(profile){
                    userinfoService.setuserInfo(profile);
                    $rootScope.$broadcast("getprofileComplete");
                })
                $state.go('tabs.home');
            }
            $scope.goSearch = function(){
                $state.go('tabs.search');
            }
            $scope.goCooksummary = function(){
                cookSummaryService.init();
                $state.go('tabs.cooksummary');
            }

            $scope.goNotice = function(){
                $scope.badgedata = '';
                $state.go('tabs.notice');
            }
        }
    ]);
