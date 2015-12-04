angular.module('cookers.services')
    .factory('noticeService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config){

            var notices = {};

            var address = cookers_config.url;

            var createContents = function(data){
                for(var i in data){
                    if(data[i].kind_code =="FM"){       // 당신을 팔로우 했습니다
                        data[i].content = data[i].from.nick_name+" 님이 당신을 팔로우 했습니다.";
                    }else if(data[i].kind_code =="R"){  // 게시물에 댓글을 남겼을습니다
                        data[i].content = data[i].from.nick_name+" 님이 "+ data[i].cook.title +" 게시물에 댓글을 남겼습니다.";
                    }else if(data[i].kind_code =="T"){  // 게시물에 태그 하셨습니다
                        data[i].content = data[i].from.nick_name+" 님이 "+data[i].cook.title+" 게시물에 태그했습니다.";
                    }else{                              //L 게시물을 좋아합니다.
                        data[i].content = data[i].from.nick_name+" 님이 "+ data[i].cook.title+" 게시물을 좋아합니다.";
                    }
                }
            };

            return {
                init :function(){
                    notices={};
                },

                getNoticeListHttpRequest : function(user_id){
                    var defer = $q.defer();
                    $http({
                        url: address+"/rest/notice/"+user_id,
                        method: 'GET'
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                },

                setNotices : function(set_data){
                    notices = set_data;
                    createContents(set_data);

                },

                getNotices : function(){
                    return notices;
                },

                updateStateCodeHttpRequest : function(notice_id){
                    var defer = $q.defer();
                    $http({
                        url: address+"/rest/notice/confirm/"+notice_id,
                        method: 'GET'
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                },

                removeNotice : function(index){
                    notices.splice(index,1);
                }
            };
        }])
    .factory('insertnoticeService',[
        '$http',
        '$q',
        'cookers_config',
        function($http, $q, cookers_config) {

            var address = cookers_config.url;
            var notice = {};
            notice.noticeHttpRequest = function(notice_object){

                var defer = $q.defer();
                $http({
                    url:address+"/rest/notice/save",
                    method: 'POST',
                    data: notice_object
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    $window.alert(data);
                });

                return defer.promise;
            };
            return notice;
        }]);

