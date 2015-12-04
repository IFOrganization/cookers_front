/**
 * Created by kimsungwoo on 2015. 10. 15..
 */
angular.module('time.directive', [])
    .directive("timeDirective", [
        function() {
            return {
                restrict: 'E',
                scope: {
                    gettimeData: '=timeData'
                },
                template: '<span>{{time_result}}</span>',

                link: function (scope, element, attributes, controller) {
                    var date = new Date(scope.gettimeData);

                    var cal_year = date.getFullYear(),
                        cal_month = date.getMonth()+ 1,
                        cal_date= date.getDate(),
                        cal_hour = date.getHours(),
                        cal_min = date.getMinutes();

                    /*return cal_year + "." + cal_month + "." + cal_date + " " + cal_hour + ":" + cal_min*/
                    /*scope.time_result = cal_month + "월 " + cal_date + "일 " + cal_hour + "시 " + cal_min + "분"*/
                    scope.time_result = cal_year + "." + cal_month + "." + cal_date + " " + cal_hour + ":" + cal_min;
                }

            }
        }
    ]);
