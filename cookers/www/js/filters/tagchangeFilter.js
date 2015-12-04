/**
 * Created by kimsungwoo on 2015. 11. 5..
 */
angular.module('cookers.filter')
    .filter('$tag_change_filter', function($sce) {
        return function(input){
            var replacedText, replacePattern1, replacePattern2;

            /**
             * cooker regex and replace
             */
            replacePattern1 = /(@[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]*)/gi;
            replacedText = input.replace(replacePattern1,
                '<button id="tag_button" class="button button-small button-clear button-positive tag_button"' +
                'ng-click="tagclicked_inReply()">$1</button>');

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
            replacedText = replacedText.replace(replacePattern2,
                '<button id="tag_button" class="button button-small button-clear button-positive tag_button"' +
                'ng-click="tagclicked_inReply()">$1</button>');


            return $sce.trustAsHtml(replacedText);

        };
    })

