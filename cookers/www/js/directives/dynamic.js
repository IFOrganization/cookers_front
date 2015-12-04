/**
 * Created by kimsungwoo on 2015. 11. 8..
 */
angular.module('reply.directive', [])
    .directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            /**
             * issue : ng-bind-html로 인해 ng-click이 동작하지 않음
             * reason : $tag_change_filter는 정규식에 의해 replace된 태그를 리턴하는데
             *          angular는 신뢰할 수 없는, 즉 컴파일 되지 않은 태그 안의 ng-click은
             *          동작 시키지 않는다.
             *          따라서 directive로 한번 더 rapping하여 compile 과정을 거치도록 함.
             */
            scope.$watch(attrs.dynamic, function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
})
