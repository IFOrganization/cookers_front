// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('cookers', [
    'ionic',
    'cookers.controllers',
    'cookers.services',
    'cookers.directives',
    'cookers.config',
    'cookers.filter',
    'ng.confirmField',
    'ngStorage',
    'angular-jwt',
    'ngCordova',
    'ngImgCrop',
    'ngIOS9UIWebViewPatch',
    'time.directive',
    'reply.directive',
    'ionicLazyLoad'
])
    .run([
        '$ionicPlatform',
        '$localStorage',
        'userinfoService',
        'cookerService',
        '$rootScope',
        '$cordovaPush',
        '$ionicLoading',
        'socket',
        'cookers_gcm_sender_id',
        function ($ionicPlatform, $localStorage, userinfoService, cookerService, $rootScope, $cordovaPush, $ionicLoading, socket) {
            $ionicPlatform.offHardwareBackButton(function(){

            });
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                //
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    if(ionic.Platform.isIOS()){
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                        cordova.plugins.Keyboard.disableScroll(true);
                    }else{
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    }
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });

            var local_token = $localStorage.token;
            if (local_token === undefined) {
                $localStorage = $localStorage.$default({
                    token: '',
                    email: '',
                    current_sign: false,
                    nick_name: '',
                    id: '',
                    cooker_photo : '',
                    dev_token : ''
                });
            } else {
                socket.emit('add user', $localStorage.id);
                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template : '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                });
                // 이미 존재할때
                cookerService.getcookerProfileHttpRequest($localStorage.id).then(function(profile){
                    $ionicLoading.hide();
                    console.log(profile)
                    userinfoService.setuserInfo(profile);
                    $rootScope.$broadcast("getprofileComplete");
                })

            }
            /**
             * Notification Recived.
             */
            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                if(ionic.Platform.isIOS()){
                    if (notification.alert) {
                        navigator.notification.alert(notification.alert);
                    }

                    if (notification.sound) {
                        var snd = new Media(event.sound);
                        snd.play();
                    }

                    if (notification.badge) {
                        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                            // Success!
                        }, function(err) {
                            // An error occurred. Show a message to the user
                        });
                    }
                }else{
                    switch(notification.event) {
                        case 'registered':
                            if (notification.regid.length > 0 ) {
                                alert('registration ID = ' + notification.regid);
                            }
                            break;

                        case 'message':
                            // this is the actual push notification. its format depends on the data model from the push server
                            alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                            break;

                        case 'error':
                            alert('GCM error = ' + notification.msg);
                            break;

                        default:
                            alert('An unknown GCM event has occurred');
                            break;
                    }
                }

            });

    }])
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, jwtInterceptorProvider, $httpProvider) {
        $ionicConfigProvider.tabs.position('bottom');

        /**
         * http interceptor.
         *
         */
        jwtInterceptorProvider.tokenGetter = ['$localStorage', function ($localStorage) {
            return $localStorage.token;
        }];

        $httpProvider.interceptors.push('jwtInterceptor');

        $httpProvider.interceptors.push(['$q', '$window', '$localStorage', '$rootScope', function ($q, $window, $localStorage, $rootScope) {

            return {
                'response': function (response) {
                    //Will only be called for HTTP up to 300
                    return response;
                },
                'responseError': function (rejection) {
                    if (rejection.status === 401) {

                        $rootScope.$broadcast('signoutEvent');

                    }
                    return $q.reject(rejection);
                }
            };
        }]);
        /**
         *
         */

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "views/home/home.html",
                        controller : "homeCtrl"
                    }
                }
            })

            .state('tabs.search', {
                url: '/search',
                views:{ //여러 개의 views json 객체는 만들 수 없음 대신 views 객체 안쪽에는 여러개를 만들 수 있음.
                    'search-tab':{
                        templateUrl : 'views/search/search.html',
                        controller : "searchCtrl"
                    }
                }
            })

            .state('tabs.searchresult_Tag', {
                url: '/searchresult_Tag/:tag',
                views:{
                    'search-tab': {
                        templateUrl : 'views/search/searchresult_Tag.html',
                        controller : "searchresulttagCtrl"
                    }
                },
                resolve:{
                    searchresultlist : ['searchbytagService', '$stateParams',
                        function(searchbytagService, $stateParams){
                            return searchbytagService.getsearchresultbyTag($stateParams.tag).then(function(data){
                                return data;
                            })
                    }]
                }
            })

            /*.state('tabs.searchresult_user', {
                url: '/searchresult_user',
                views:{
                    'search-tab': {
                        templateUrl : 'views/search/searchresult_user.html'
                    }
                }
            })*/

            .state('tabs.cooksummary', {
                url: '/cooksummary',
                views:{
                    'cooksummary-tab':{
                        templateUrl: 'views/cooksummary/cooksummary.html',
                        controller : 'cookSummaryCtrl'
                    }
                }
            })

            .state('tabs.cookStepGallery', {
                url: '/cookStepGallery',
                views:{
                    'cooksummary-tab':{
                        templateUrl: 'views/cooksummary/cookStepGallery2.html',
                        controller : 'cookStepGalleryCtrl2'
                    }
                }
            })

            .state('tabs.inputDetailStep', {
                url: '/inputDetailStep/:index',
                views:{
                    'cooksummary-tab':{
                        templateUrl: 'views/cooksummary/inputDetailStep.html',
                        controller : 'inputDetailStepCtrl'
                    }
                }
            })

            .state('tabs.notice', {
                url: '/notice',
                views:{
                    'notice-tab' : {
                        templateUrl: 'views/notice/notice.html',
                        controller : 'noticeCtrl'
                    }
                },
                resolve : {
                    noticeList : ['noticeService', '$localStorage', '$rootScope',
                        function(noticeService, $localStorage, $rootScope){
                            console.log("notice-resolve : " + $localStorage.id );
                            return noticeService.getNoticeListHttpRequest($localStorage.id)
                                .then(function(data){
                                    noticeService.init();
                                    noticeService.setNotices(data);
                                    $rootScope.$broadcast('notice_reset');
                                });
                        }
                    ]
                }
            })
            .state('tabs.user', {
                url: '/user/:userid',
                cache:false,
                views:{
                    'user-tab':{
                        templateUrl: 'views/user/user.html',
                        controller: 'cookerController'
                    }
                },
                resolve: {
                    userStatus: ['$stateParams', '$localStorage', 'cookerinfoService', 'cookerService','$rootScope',
                        function ($stateParams, $localStorage, cookerinfoService, cookerService, $rootScope) {
                            var temp = {};
                            if($stateParams.userid != ""){
                                return cookerService.getcookerProfileHttpRequest($stateParams.userid).then(function (res_data) {
                                    cookerinfoService.setcookerInfo(res_data.cooker_profile);
                                    cookerinfoService.setcookerZimmy(res_data.cooker_zimmy);
                                    cookerinfoService.setcookerMycook(res_data.cooker_mycook);

                                    temp.check_userinfo = false;
                                    if ($stateParams.userid == $localStorage.id) {
                                        temp.check_myuserinfo = true;
                                        /*return true;*/
                                    } else {
                                        temp.check_myuserinfo = false;
                                        /*return false;*/
                                    }
                                    return temp;

                                });
                            } else{
                                temp.check_userinfo = true;
                                return temp;
                            }
                        }]
                }
            })
            .state('tabs.edit', {
                url: '/edit/:userid',

                views:{
                    'user-tab' : {
                        templateUrl: 'views/user/editprofile.html',
                        controller : 'editprofileController'
                    }
                },
                resolve:{
                    editcookerInfo : ['cookerinfoService',function(cookerinfoService){
                        return cookerinfoService.getcookerInfo();
                    }]
                }
            })
            .state('tabs.follow', {
                url: '/follow/:userid',
                cache : false,
                views:{
                    'user-tab' : {
                        templateUrl: 'views/user/followinglist.html',
                        controller : 'followController'
                    }
                },
                resolve:{
                    cookerfollow : ['cookerinfoService','$stateParams','cookerService', function(cookerinfoService,$stateParams,cookerService){

                        return cookerService.getcookerProfileHttpRequest($stateParams.userid).then(function (res_data) {

                            cookerinfoService.setcookerInfo(res_data.cooker_profile);
                            return cookerinfoService.getcookerInfo();

                        });
                    }]
                }
            })
            .state('tabs.follower', {
                url: '/follower/:userid',
                cache : false,
                views:{
                    'user-tab' : {
                        templateUrl: 'views/user/followerlist.html',
                        controller : 'followerController'

                    }
                },
                resolve : {
                    cookerfollower : ['cookerinfoService','$stateParams','cookerService', function(cookerinfoService,$stateParams,cookerService){
                        return cookerService.getcookerProfileHttpRequest($stateParams.userid).then(function (res_data) {

                            cookerinfoService.setcookerInfo(res_data.cooker_profile);
                            return cookerinfoService.getcookerInfo();

                        });
                    }]
                }
            });

        $urlRouterProvider.otherwise("/tab/home");
    });

angular.module('cookers.controllers', []);

angular.module('cookers.services', ['btford.socket-io']);

angular.module('cookers.directives', []);

angular.module('cookers.config', []);

angular.module('cookers.filter', []);
