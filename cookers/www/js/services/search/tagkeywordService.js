/**
 * Created by kimsungwoo on 2015. 10. 30..
 */
angular.module('cookers.services')
    .factory('tagkeywordService',[function(){
        var tag_keyword = undefined;
        return {
            set_tagKeyword: function(tag_name){
                tag_keyword = tag_name;
            },
            get_tagKeyword: function(){
                return tag_keyword;
            }
        }
    }]);
