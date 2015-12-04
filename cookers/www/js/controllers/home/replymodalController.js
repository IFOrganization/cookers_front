/**
 * Created by kimsungwoo on 2015. 10. 21..
 */
angular.module('cookers.controllers')
    .controller('replymodalCtrl',[
        '$scope',
        '$ionicScrollDelegate',
        '$ionicPopover',
        '$sce',
        '$compile',
        '$state',
        '$rootScope',
        '$ionicPopup',
        'cookmodelManage',
        'userinfoService',
        'addreplyService',
        'getreplyinitialdataService',
        'searchService',
        'focusService',
        'getcookeridService',
        'tagkeywordService',
        'deletereplyService',
        'insertnoticeService',
        function($scope, $ionicScrollDelegate, $ionicPopover, $sce, $compile, $state, $rootScope, $ionicPopup, cookmodelManage,
                 userinfoService, addreplyService, getreplyinitialdataService, searchService, focusService, getcookeridService,
                 tagkeywordService, deletereplyService, insertnoticeService) {

            $scope.myProfile = userinfoService.getuserInfo().cooker_profile;
            $scope.cook_model = cookmodelManage.get_cookmodel();

            var search_text = "",
                my_regex = undefined,
                my_regex_array = undefined;

            var temp_val = undefined,
                temp_array = [];

            var beforeapply_comment = undefined,
                beforeapply_array = undefined,
                beforeapplyPtn = undefined;

            $scope.userlist_show = false;
            $scope.taglist_show = false;
            $scope.checkmy_Report = false;
            $scope.checkothers_Report = true;

            /**
             * 현재 이 cook에는 댓글 단 사용자들의 id만 있음.
             * 초기 페이지 로딩시 populate를 통해 사용자 정보를 가져와야함. (nick_name cooker_photo)
             */

            var initial_object = {};
            initial_object.reply_id = $scope.cook_model.reply._id;
            initial_object.cook_id = $scope.cook_model._id;

            getreplyinitialdataService.initialreplydataHttpRequest(initial_object).then(function(data){
                /**
                 * reply 초기 요청.
                 * 이 cook의 댓글 대이터를 가져옴.
                 */

                $scope.cookers = data.cookers; //댓글 단 사용자들

                if($scope.cookers.length == 0){
                    $scope.comments_check = true;
                } else {
                    $scope.comments_check = false;
                }
            });

            $scope.apply_comment = function(){

                var reply_object = {};
                reply_object.reply_id = $scope.cook_model.reply._id;
                reply_object.cooker_id = $scope.myProfile._id;
                reply_object.comment = $scope.write_comment;

                addreplyService.addreplyHttpRequest(reply_object).then(function(data){
                    $scope.cookers = data.cookers;
                    $scope.write_comment = "";

                    if($scope.cookers.length == 0){
                        $scope.comments_check = true;
                    } else {
                        $scope.comments_check = false;
                    }

                    var notice = {};
                    notice.kind_code = "R";
                    notice.from = $scope.myProfile._id;
                    notice.to = $scope.cook_model.w_cooker._id;
                    notice.cook = $scope.cook_model._id;

                    insertnoticeService.noticeHttpRequest(notice);

                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                });

                /**
                 * 위 쪽에서 댓 글 등록 http 요청 후
                 * 해당 댓 글에 사용자가 태그 되었나 찾음
                 * 찾은 결과가 null이 아니면 notice요청
                 */

                beforeapply_comment = $scope.write_comment;
                beforeapply_array = undefined;
                beforeapplyPtn = /(@[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;

                beforeapply_array = beforeapply_comment.match(beforeapplyPtn);

                console.log(beforeapply_array);
                if(beforeapply_array != null){

                    for(var i in beforeapply_array){
                        var pop_val = beforeapply_array[i];
                        var split_array = pop_val.split('@');

                        var search_param = {};
                        search_param.type = "cookers";
                        search_param.search_text = split_array[1];


                        searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                            /**
                             * 사용자가 태그됨을 알리는 notice 요청
                             */

                            if(data.length != 0){
                                var notice = {};
                                notice.kind_code = "T";
                                notice.from = $scope.myProfile._id;
                                notice.to = data[0]._id;
                                notice.cook = $scope.cook_model._id;
                                insertnoticeService.noticeHttpRequest(notice);
                            }

                        })
                    }
                }
            }

            $scope.closeModal = function() {
                $scope.replymodal.hide();
            };


            /**
             * moreinfoPopover
             * --> 댓글 팝오버.
             *      본인의 댓글일 땐 수정, 삭제 기능
             *      타인의 댓글일 땐 신고 기능
             */
            $ionicPopover.fromTemplateUrl('views/home/moreinfopopoverTemplate.html', {
                scope: $scope,
            }).then(function(popover) {
                $scope.moreinfoPopover = popover;
            });

            $scope.openmoreinfoPopover = function($event, nick_name, get_reply_cookers_id) {
                /**
                 * $scope.reply_cookers_id는 moreinfopopoverTemplete에서 사용하기 위한 scope변수이다.
                 * popover열면서 댓글당 id를 셋 하면 다른 템플릿(moreinfopopoverTemplete)에서 사용할 수 있다.
                 */
                $scope.reply_cookers_id = get_reply_cookers_id;

                if($scope.myProfile.nick_name == nick_name){
                    $scope.checkmy_Report = true;
                    $scope.checkothers_Report = false;
                } else {
                    $scope.checkmy_Report = false;
                    $scope.checkothers_Report = true;
                }
                $scope.moreinfoPopover.show($event);
            };

            $scope.closemoreinfoPopover = function(check_param) {

                if(check_param == 'mine'){
                    //삭제
                    $scope.showConfirm();
                } else {
                    //신고
                }

                $scope.moreinfoPopover.hide();
            };

            $scope.showConfirm = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '댓글 삭제',
                    template: '정말 삭제하시겠습니까?',
                    cancelText:'아니오',
                    cancelType:'button-dark',
                    okText:'예',
                    okType:'button-balanced'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        /**
                         * 1. 서버로 삭제 요청 params : reply._id, reply.cookers[0]._id
                         * 2. 서버측에선 위 두 id로 댓글 삭제 후 해당 reply data 반환
                         * 3. $scope 상에 다시 set하여 화면 리 렌더링
                         */

                        deletereplyService.deletereplyHttpRequest($scope.cook_model.reply._id, $scope.reply_cookers_id).then(function(){
                            var initial_object = {};
                            initial_object.reply_id = $scope.cook_model.reply._id;
                            initial_object.cook_id = $scope.cook_model._id;

                            getreplyinitialdataService.initialreplydataHttpRequest(initial_object).then(function(data){
                                /**
                                 * reply 초기 요청.
                                 * 이 cook의 댓글 대이터를 가져옴.
                                 */

                                $scope.cookers = data.cookers; //댓글 단 사용자들

                                if($scope.cookers.length == 0){
                                    $scope.comments_check = true;
                                } else {
                                    $scope.comments_check = false;
                                }
                            })
                        });


                    }
                });
            };


            /**
             * tagPopover
             * --> 태그 팝오버
             *      @사용자명
             *      #태그명
             */
            $ionicPopover.fromTemplateUrl('views/home/tagpopoverTemplate.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.tagPopover = popover;
            });


            var condition = undefined;
            $scope.tagtext_change = function($event) {

                /**
                 * ng-change로는 $event 객체를 받아올 수 없기 때문에
                 * ng-keyup 메서드를 사용함.
                 */

                search_text = $scope.write_comment;

                if($event.keyCode == 50){
                    //keyCode = @
                    condition = "@";
                    my_regex = /(@[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;
                }
                else if($event.keyCode == 51){
                    //keyCode = #
                    condition = "#";
                    my_regex = /(#[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;
                }
                else if($event.keyCode == 32){
                    //keyCode = space
                    condition = " ";
                    $scope.tagPopover.hide();
                }

                if(condition == "@"){
                    my_regex_array = search_text.match(my_regex);
                    if(my_regex_array != null){
                        temp_val = my_regex_array.pop();
                        temp_array = temp_val.split('@');

                        //추출한 문자열의 길이가 1 이상일때만 요청. 아니면 모든 유저목록을 가져옴.
                        if(temp_array[1].length > 0){
                            var search_param = {};
                            search_param.type = "cooker";
                            search_param.search_text = temp_array[1];

                            searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                                $scope.taglist_show = false;

                                if(data.length != 0){
                                    $scope.cooker_list = data;
                                    $scope.userlist_show = true;

                                    $scope.tagPopover.show($event);
                                } else {
                                    $scope.userlist_show = false;
                                    $scope.tagPopover.hide();
                                }
                            })
                        }
                    }
                } else if(condition == "#"){
                    my_regex_array = search_text.match(my_regex);
                    if(my_regex_array != null){

                        temp_val = my_regex_array.pop();
                        temp_array = temp_val.split('#');

                        //추출한 문자열의 길이가 1 이상일때만 요청. 아니면 모든 유저목록을 가져옴.
                        if(temp_array[1].length > 0){
                            var search_param = {};
                            search_param.type = "tag";
                            search_param.search_text = temp_array[1];

                            searchService.searchautocompleteHttpRequest(search_param).then(function(data){
                                $scope.userlist_show = false;
                                if(data.length != 0){
                                    $scope.tag_list = data;
                                    $scope.taglist_show = true;
                                    $scope.tagPopover.show($event);

                                } else {
                                    $scope.taglist_show = false;
                                    $scope.tagPopover.hide();
                                }
                            })
                        }
                    }
                }
            }

            $scope.choosecookertag = function(previous_text, param) {
                /**
                 * cooker태그 선택후 로직 구현
                 */

                var temp = $scope.write_comment;

                if(param == "cooker"){
                    temp = temp.replace(/@\S*$/gi,'');
                    $scope.write_comment = temp + '@' + previous_text + "";
                } else {
                    temp = temp.replace(/#\S*$/gi,'');
                    $scope.write_comment = temp + '#' + previous_text + "";
                }

                $scope.tagPopover.hide();
                focusService('reply_input');
            };

            $scope.tagclicked_inReply = function(type, param){
                /**
                 * 댓글 상에서 태그가 눌렸을때 이벤트 메서드 구현
                 */
                var res = param.substring(1);

                if(type == "cooker"){
                    /**
                     * 1. 서버로부터 cooker_id 가져옴.
                     * 2. $state.go 로 페이지 이동.
                     */
                    getcookeridService.getcookeridbyNicknameHttpRequest(res).then(function(data){
                        $scope.replymodal.hide();
                        $rootScope.$broadcast('close_showcookingmodal');
                        $state.go('tabs.user',{userid : data._id});
                    });
                } else {
                    /**
                     * tagkeywordService.set_tagKeyword(tag_name);
                     * $state.go('tabs.searchresult_Tag',{tag:tag_name});
                     */
                    $scope.replymodal.hide();
                    $rootScope.$broadcast('close_showcookingmodal');
                    tagkeywordService.set_tagKeyword(res);
                    $state.go('tabs.searchresult_Tag',{tag:res});
                }
            }

            $scope.compilengbindHtml = function(comment){

                //@지네딘튀랑 @낭낭맘 태그태그!! #미소된장국

                var replacePattern1, replacePattern2;
                $scope.replacedText = "";


                replacePattern1 = /(@[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;
                $scope.replacedText = comment.replace(replacePattern1,
                    '<a id="tag_button" style="font-size:15px; padding:0px;" class="button button-small button-clear button-positive tag_button" ng-click="tagclicked_inReply(\'cooker\',\'$1\')">$1</a>');


                //$1은 뭐징??
                /**
                 * The $1, ..., $9 properties are static, there are not a property of an individual regular expression object.
                 * Instead, you always use them as RegExp.$1, ..., RegExp.$9.
                 * The values of these properties are read-only and modified whenever successful matches are made.
                 */

                /**
                 * tag regex and replace
                 */
                replacePattern2 = /(#[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;
                $scope.replacedText = $scope.replacedText.replace(replacePattern2,
                    '<a id="tag_button" style="font-size:15px; padding:0px;" class="button button-small button-clear button-positive tag_button" ng-click="tagclicked_inReply(\'tag\',\'$1\')">$1</a>');


                return $scope.replacedText;
            }
        }]);
