angular.module('cookers.services')
    .factory('cookSummaryService',[
        '$http',
        '$q',
        'userinfoService',
        'cookers_config',
        function($http, $q, userinfoService, cookers_config){

            /**
             * cook : cookSummary, cookStepGallery, inputDetailStep 에서 사용되는 객체.
             * httpCook : $http 모듈 이용해 서버에 데이터 보낼때 사용되는 객체.
             * originCook : http cook과 비교를 위한 객체. 초기 설정값이 그대로 들어가 있음.
             * httpEditCook : originCook, httpCook 비교 후 바뀐 데이터있는지 확인 후 데이터 세팅.
             */
            var cook = {};
            var httpCook = {};
            var originCook = {};
            var httpEditCook = {};
            var initImage = 'img/no_image.jpg';
            var init = function(){
                cook = {
                    _id : "",
                    update_flag : false,
                    summary : [{
                        title : '',
                        desc : '',
                        inputStuff : '',
                        stuffs : [],
                        inputTag : '',
                        tags : [],
                        photo : 'img/cooksummary.png'
                    },
                    {
                        plus_button : true
                    }]
                };
            }
            init();

            /**
             * stringValidationCheck
             * tagValidationCheck
             * stepValidationCheck
             *
             * 위 3개의 메서드는 모두 validation check를 위한 메서드.
             */
            var stringValidationCheck = function(property, title){
                if(property ==undefined || property.trim()==''){
                    alert(title+"을 입력해주세요.");
                    return true;
                }
                return false;
            }

            var tagValidationCheck = function(property, title){
                if(property ==undefined || property.length ==0){
                    alert(title + "을 입력해주세요.");
                    return true;
                }
                return false;
            }

            var stepImageValidationCheck = function(property, title){
                if(property.trim() == initImage){
                    alert(title + "을 선택해주세요.");
                    return true;
                }
                return false;
            }

            var stepValidationCheck = function(property, title){
                if(property ==undefined || property.length == 2){
                    alert('최소 1개 이상의'+ title + "이 필요합니다.");
                    return true;
                }else{
                    for(var i in property){
                        if(i==0 || i ==property.length-1) continue;
                        if(stepImageValidationCheck(property[i].photo, 'Step.'+ i +'의 사진')) return true;
                        if(stringValidationCheck(property[i].content, 'Step.'+ i +'의 내용')) return true;

                    }
                }
                return false;
            }


            return {
                init : function(){
                    init();
                },
                /**
                 * return summary[0] : title, stuffs, desc, tag, photo<complete_photo>
                 * @returns {*}
                 */
                getMainSummary : function(){
                    return cook.summary[0];
                },

                getCook : function(){
                    return cook;
                },

                initInputStuff : function(){
                    cook.summary[0].inputStuff = '';
                },

                addStuff : function(stuff){
                    if(stuff===undefined) stuff = cook.summary[0].inputStuff;
                    cook.summary[0].stuffs.push({
                        stuff_name : stuff
                    });
                },

                removeStuff : function(index){
                    if(index ===undefined){
                        cook.summary[0].stuffs.splice(cook.stuffs.length-1,1);
                    }else{
                        cook.summary[0].stuffs.splice(index,1);
                    }
                },

                initInputTag : function(){
                    cook.summary[0].inputTag = '';
                },

                addTag : function(tag_name){
                    cook.summary[0].tags.push({
                        tag_name : tag_name
                    });
                },

                removeTag : function(index){
                    if(index ===undefined){
                        cook.summary[0].tags.splice(cook.stuffs.length-1,1);
                    }else{
                        cook.summary[0].tags.splice(index,1);
                    }
                },

                addSummary : function(){
                    cook.summary.splice(cook.summary.length-1, 0,{
                        content : '',
                        photo : initImage,
                    });
                },

                removeSummary : function(index){
                    cook.summary.splice(index, 1);
                    return cook.summary.length;
                },

                getSummary : function(index){
                    return cook.summary[index];
                },

                validationCheck : function(){
                    if(stringValidationCheck(cook.summary[0].title, "제목") || stringValidationCheck(cook.summary[0].desc, "간단설명")
                        || tagValidationCheck(cook.summary[0].stuffs,"재료") || tagValidationCheck(cook.summary[0].tags,"태그")
                        || stepValidationCheck(cook.summary, "Step")){
                        return true;
                    }
                    return false;
                },

                setHttpCook : function(){
                    httpCook = {};

                    var tempSteps = [];
                    for(var i = 1 ; i < cook.summary.length-1; i++){

                        tempSteps.push({
                            _id : cook.summary[i]._id,
                            photo : '',
                            content : cook.summary[i].content
                        });
                    }


                    httpCook = {
                        w_cooker : userinfoService.getuserInfo().cooker_profile._id,
                        title : cook.summary[0].title,
                        desc : cook.summary[0].desc,
                        stuffs : cook.summary[0].stuffs,
                        tags : cook.summary[0].tags,
                        steps : tempSteps
                    }
                },

                submitCook : function(){
                    var url = cookers_config.url+"/rest/recipe/register";

                    var defer = $q.defer();
                    $http({
                        url: url,
                        method: 'POST',
                        data : httpCook
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;

                },

                submitPhoto : function(_id, steps){
                    var tempSteps = [];
                    for(var i = 1 ; i < cook.summary.length-1; i++){
                        tempSteps.push({
                            fileName : steps[i-1]._id,
                            step : i,
                            photo : cook.summary[i].photo
                        });
                    }

                    var url = cookers_config.url+'/rest/photo/upload/';

                    var defer = $q.defer();
                    $http({
                        url: url + _id,
                        method: 'POST',
                        data : tempSteps
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;

                },

                submitFail : function(cook_id, yummy_id, reply_id){
                    $http({
                        url: url + cook_id+ "/"+ yummy_id+ "/"+ reply_id,
                        method: 'POST',
                        data : tempSteps
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                },

                setCook : function(new_cook){
                    cook = new_cook;
                },

                getHttpCook : function(){
                    return httpCook;
                },

                setOriginCook : function(){
                    originCook = {};

                    var tempSteps = [];
                    for(var i = 1 ; i < cook.summary.length-1; i++){
                        tempSteps.push({
                            _id : cook.summary[i]._id,
                            photo : cook.summary[i].photo,
                            content : cook.summary[i].content
                        });
                    }

                    originCook = {
                        w_cooker : userinfoService.getuserInfo().cooker_profile._id,
                        title : cook.summary[0].title,
                        desc : cook.summary[0].desc,
                        stuffs : cook.summary[0].stuffs.slice(0),
                        tags : cook.summary[0].tags.slice(0),
                        steps : tempSteps
                    }
                },

                getOriginCook : function(){
                    return originCook;
                },

                compareOriginHttpCook : function(){
                    /**
                     * 비교 전, httpEditCook 초기화.
                     */
                    httpEditCook = {};
                    /**
                     * 두객체 비교후 httpEditCook setting
                     */
                    var changedCondition = false;

                    if(originCook.title.trim() != httpCook.title.trim()){
                        httpEditCook["title"] = httpCook.title.trim();
                        changedCondition = true;
                    }

                    if(originCook.desc.trim() != httpCook.desc.trim()){
                        httpEditCook["desc"] = httpCook.desc.trim();
                        changedCondition = true;
                    }

                    if(originCook.stuffs.length != httpCook.stuffs.length){
                        httpEditCook["stuffs"] = httpCook.stuffs;
                        httpEditCook["stuff_quantity"] = httpEditCook.stuffs.length;
                        changedCondition = true;
                    }else{
                        var i;
                        for( i in originCook.stuffs){
                            if(originCook.stuffs[i].stuff_name.trim() != httpCook.stuffs[i].stuff_name.trim()){
                                break;
                            }
                        }
                        if(i < originCook.stuffs.length-1){
                            httpEditCook["stuffs"] = httpCook.stuffs.trim();
                            changedCondition = true;
                        }
                    }

                    if(originCook.tags.length != httpCook.tags.length){
                        httpEditCook["tags"] = httpCook.tags;
                        changedCondition = true;
                    }else{
                        var i;
                        for( i in originCook.tags){
                            if(originCook.tags[i].tag_name.trim() != httpCook.tags[i].tag_name.trim()){
                                break;
                            }
                        }
                        if(i = originCook.tags.length-1){
                            httpEditCook["tags"] = httpCook.tags;
                            changedCondition = true;
                        }
                    }

                    if(originCook.steps.length != httpCook.steps.length){
                        httpEditCook["steps"] = httpCook.steps;
                        changedCondition = true;
                    }else{
                        var i;
                        for( i in originCook.steps ){
                            if(originCook.steps[i].content != httpCook.steps[i].content || originCook.steps[i].photo != httpCook.steps[i].photo ){
                                break;
                            }
                        }
                        if(i < originCook.steps.length-1){
                            httpEditCook["steps"] = httpCook.steps;

                            changedCondition = true;
                        }
                    }
                    return changedCondition;
                },

                getHttptEditCook : function(){
                    return httpEditCook;
                },

                submitEditCook : function(){
                    var url = cookers_config.url+"/rest/recipe/modify/"+cook._id;

                    var defer = $q.defer();
                    $http({
                        url: url,
                        method: 'POST',
                        data : httpEditCook
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;

                },

                addOriginPhotoNameInHttpEditCook : function(){
                    httpEditCook.origin_step_ids = [];
                    for(var i in originCook.steps){
                        httpEditCook.origin_step_ids[i]= originCook.steps[i]._id;
                    }
                },

                submitEditPhoto : function(current_id_arrays, removes, skips){
                    var editPhoto = {
                        removes : removes
                    };

                    var tempSteps = [];
                    ;
                    for(var i = 1 ; i < cook.summary.length-1; i++){
                        if(skips.length>0){
                            if(skips[0] == i-1){
                                skips.splice(0,1);
                                continue;
                            }
                        }
                        tempSteps.push({
                            fileName : current_id_arrays[i-1],
                            step : i,
                            photo : cook.summary[i].photo
                        });
                    }

                    editPhoto.steps = tempSteps;

                    var url = cookers_config.url+'/rest/photo/upload/edit/'+cook._id;

                    var defer = $q.defer();
                    $http({
                        url: url,
                        method: 'POST',
                        data : editPhoto
                    }).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                }
            }
        }
    ]);
