angular.module('cookers.controllers')
    .controller('cookSummaryCtrl', [
        '$scope',
        '$state',
        'cookSummaryService',
        function($scope, $state, cookSummaryService){
            $scope.cook = cookSummaryService.getMainSummary();
            console.log($scope.cook);

            $scope.nextBtnClick = function(){
                console.log($scope.cook);
                $state.go('tabs.cookStepGallery');
            }
            /**
             * event.keyCode = 13 : \n
             * event.keyCode = 32 : ' '
             * event.keyCode = 188 : ','
             * 위와 같이 입력 될 경우, Stuffs에 추가.
             * @param event
             */
            $scope.kyeUpStuff = function(event){
                if(event.keyCode===13 || event.keyCode===188){
                    if($scope.cook.inputStuff.trim()=="") return;
                    $scope.cook.inputStuff = $scope.cook.inputStuff.replace(/\s+/gi,' ');
                    //$scope.cook.inputStuff = $scope.cook.inputStuff.replace(/\d[0-3]\S*/gi,'');

                    if($scope.cook.inputStuff.length>0){
                        for(var i in $scope.cook.stuffs){
                            if($scope.cook.inputStuff === $scope.cook.stuffs[i].stuff_name){
                                angular.element(document.querySelector( '#input_stuff' )).css("color","red");
                                return;
                            }
                        }
                        cookSummaryService.addStuff($scope.cook.inputStuff);
                        cookSummaryService.initInputStuff();
                    }
                }
                angular.element(document.querySelector( '#input_stuff' )).css("color","black");
            }

            $scope.removeStuff = function(index){
                cookSummaryService.removeStuff(index);
            }

            $scope.keyUpTag = function(event){
                if(event.keyCode===13 || event.keyCode===188 ){
                    if($scope.cook.inputTag.trim()=="") return;
                    $scope.cook.inputTag = $scope.cook.inputTag.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi,'');
                    $scope.cook.inputTag = $scope.cook.inputTag.replace(/\s*/gi,'');

                    if($scope.cook.inputTag.length>0){

                        for(var i in $scope.cook.tags){
                            if($scope.cook.inputTag === $scope.cook.tags[i].tag_name){
                                angular.element(document.querySelector( '#input_tag' )).css("color","red");
                                return;
                            }
                        }
                        cookSummaryService.addTag($scope.cook.inputTag);
                        cookSummaryService.initInputTag();
                    }
                }
                angular.element(document.querySelector( '#input_tag' )).css("color","black");
            }

            $scope.removeTag = function(index){
                cookSummaryService.removeTag(index);
            }
        }
    ]);
