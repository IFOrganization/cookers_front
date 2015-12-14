/**
 * Created by kimsungwoo on 2015. 10. 26..
 */
angular.module('cookers.controllers')
    .controller('searchCtrl',[
        '$scope',
        '$ionicModal',
        '$ionicLoading',
        '$ionicSlideBoxDelegate',
        '$timeout',
        '$state',
        'searchService',
        'currentinfoService',
        'tagkeywordService',
        function($scope, $ionicModal, $ionicLoading, $ionicSlideBoxDelegate, $timeout, $state, searchService,
                 currentinfoService, tagkeywordService) {
            /*var str = 'bcde';

             str =str.replace(/\D+/gi,'aaa');
             //d* 무한대 까지의 숫자
             //D+는 모든문자가 하나 이상
             //s 공백
             //S 문자
             //
             console.log(str);*/

            $scope.search_input = false;
            $scope.search_text = "";
            $scope.tag_show = false;
            $scope.cook_show = false;
            $scope.cookers_show = false;
            $scope.recommend_show = true;
            $scope.active = '';
            $scope.cook_count = 10;

            $scope.search = function(){

                if($scope.search_text.length >= 1){
                    var search_param = {};
                    search_param.type = $scope.active;
                    search_param.search_text = $scope.search_text;

                    if($scope.active == "tag"){
                        $scope.tag_show = true;
                        $scope.cook_show = false;
                        $scope.cookers_show = false;

                        searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                            $scope.tag_counts = data;
                        });

                    } else if($scope.active == "cook"){
                        $scope.tag_show = false;
                        $scope.cook_show = true;
                        $scope.cookers_show = false;

                        /**
                         * cook 제목 검색
                         */
                        searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                            $scope.cook_list = data;
                        });

                    } else {
                        $scope.tag_show = false;
                        $scope.cook_show = false;
                        $scope.cookers_show = true;

                        /**
                         * cookers 검색
                         */
                        searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                            console.log(data);
                            $scope.cookers_list = data;
                        })
                    }

                } else {
                    $scope.tag_show = false;
                    $scope.cook_show = false;
                    $scope.cookers_show = false;
                }

            }

            $scope.gotoshowcookingTemplate = function(cook_id){
                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>'
                });

                $state.go('tabs.showcook',{cook_id:cook_id});

                $timeout(function () {
                    $ionicLoading.hide();

                }, 1000);
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            $scope.gotagsearchResult = function(tag_name){
                /**
                 * 태그를 검색 한 후 자동완성된 키워드를 터치하면
                 * 해당 키워드의 태그가 포함된 레시피 목록을 보여줌.
                 */

                tagkeywordService.set_tagKeyword(tag_name);
                $state.go('tabs.searchresult_Tag',{tag:tag_name});

            }

            $scope.setActive = function(getType) {
                /**
                 * sub-header의 버튼 활성화 메서드
                 */

                $scope.recommend_show = false;
                $scope.search_input = true;
                $scope.search_text = "";

                $scope.tag_show = false;
                $scope.cook_show = false;
                $scope.cookers_show = false;


                if(getType == "tag"){
                    $scope.search_type = "태그 검색"
                } else if(getType == "cook"){
                    $scope.search_type = "쿡 검색"
                } else {
                    $scope.search_type = "쿠커스 검색"
                }
                $scope.active = getType;
            };

            $scope.isActive = function(type) {
                return type === $scope.active;
            };
        }]);
