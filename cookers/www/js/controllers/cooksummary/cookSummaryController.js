angular.module('cookers.controllers')
    .controller('cookSummaryCtrl', [
        '$scope',
        '$state',
        'cookSummaryService',
        function($scope, $state, cookSummaryService){
            $scope.cook = cookSummaryService.getMainSummary();
            console.log($scope.cook);
            $scope.input = {
                stuff :"",
                tag :""
            };

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

                    if($scope.input.stuff.trim()=="") return;

                    $scope.input.stuff = $scope.input.stuff.replace(/\s+&/gi,' ');

                    if($scope.input.stuff.length>0){
                        for(var i in $scope.cook.stuffs){
                            if($scope.input.stuff === $scope.cook.stuffs[i].stuff_name){
                                angular.element(document.querySelector( '#input_stuff' )).css("color","red");
                                return;
                            }
                        }
                        cookSummaryService.addStuff($scope.input.stuff);
                        $scope.input.stuff=null;
                    }
                }
                angular.element(document.querySelector( '#input_stuff' )).css("color","black");
            }

            $scope.removeStuff = function(index){
                cookSummaryService.removeStuff(index);
            }

            $scope.keyUpTag = function(event){
                if(event.keyCode===13 || event.keyCode===188 ){
                    if($scope.input.tag.trim()=="") return;
                    $scope.input.tag = $scope.input.tag.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"\s*]/gi,'');

                    if($scope.input.tag.length>0){

                        for(var i in $scope.cook.tags){
                            if($scope.input.tag === $scope.cook.tags[i].tag_name){
                                angular.element(document.querySelector( '#input_tag' )).css("color","red");
                                return;
                            }
                        }
                        cookSummaryService.addTag($scope.input.tag);
                        $scope.input.tag =null;
                    }
                }
                angular.element(document.querySelector( '#input_tag' )).css("color","black");
            }

            $scope.removeTag = function(index){
                cookSummaryService.removeTag(index);
            }
        }
    ]);
