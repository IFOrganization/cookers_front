/**
 * Created by airnold on 15. 10. 8..
 */

/**
 * Created by airnold on 15. 10. 7..
 */


String.prototype.replaceAt = function (index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
};

angular.module('cookers.controllers')
    .controller('signController', [
        '$scope',
        '$rootScope',
        'signService',
        '$ionicLoading',
        '$timeout',
        'userinfoService',
        '$localStorage',
        'socket',
        function ($scope, $rootScope, signService, $ionicLoading, $timeout, userinfoService, $localStorage, socket) {

            /**
             *
             * signin service
             * si => signin
             * ac => agree check
             */
            $scope.sign_page = 'si';
            $scope.pre_sign_page = '';

            $scope.signin = {
                signin_email: '',
                signin_checkemail: false,

                signin_pw: '',
                signin_check: false
            };

            $scope.signinEvent = function () {
                if($scope.signin.signin_checkemail == true){
                    $ionicLoading.show({
                        template: '가입된 이메일이 아닙니다<i class="ion-alert"></i>'
                        , noBackdrop: true
                        , duration: 2000
                    });
                    $scope.signin.signin_email = '';
                }else{
                    $ionicLoading.show({
                        showBackdrop: false,
                        showDelay: 0,
                        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'

                    });
                    signService.signinhttpRequest($scope.signin).then(function (sign_response_data) {
                        if (sign_response_data.sign_success == true) {
                            //로그인 성공
                            $timeout(function () {

                                $scope.signin.signin_check = false;

                                $ionicLoading.hide();

                                /**
                                 *
                                 * 정보 초기화
                                 *
                                 * 로컬 스토리지에 추가 할것 ( 닉네임 메일 ID 토큰 )
                                 *
                                 * singleton 에 유지시킬것 profile 저장해주기
                                 *
                                 * 후에 current sign 만 바꿔주면 로그인 끝
                                 *
                                 */

                                userinfoService.setuserInfo(sign_response_data);


                                $localStorage.email = sign_response_data.cooker_profile.email;
                                $localStorage.nick_name = sign_response_data.cooker_profile.nick_name;
                                $localStorage.token = sign_response_data.sign_token;
                                $localStorage.current_sign = true;
                                $localStorage.id = sign_response_data.cooker_profile._id;
                                $localStorage.cooker_photo = sign_response_data.cooker_profile.cooker_photo;

                                $rootScope.$broadcast("getprofileComplete");

                                socket.emit('add user', $localStorage.id);

                                $scope.$emit('closeModal');


                            }, 1000);
                        } else {
                            //로그인 실패

                            $timeout(function () {

                                $ionicLoading.hide();
                                $scope.signin.signin_check = true;

                            }, 1000);

                        }

                    });
                }



            };

            $scope.signinemailCheck = function () {
                if ($scope.signin.signin_email == '') {
                    $scope.signin.signin_checkemail = false;
                } else {
                    signService.signCheckEmailRequest($scope.signin.signin_email, 'in').then(function (data) {
                        console.log(data);
                        if (data === false) {

                            $scope.signin.signin_checkemail = data;

                        } else {

                            /*var signininput = angular.element('#signinid');
                             signininput.focus();*/
                            $scope.signin.signin_checkemail = data;
                        }
                    });
                }


            };


            $scope.goAgreePageEvent = function () {
                $scope.pre_sign_page = $scope.sign_page;
                $scope.sign_page = 'ac';
            };

            $scope.findEmailEvent = function () {
                $scope.pre_sign_page = $scope.sign_page;
                $scope.sign_page = 'fe';
            };

            $scope.findPasswordEvent = function () {
                $scope.pre_sign_page = $scope.sign_page;
                $scope.sign_page = 'fp';
            };


            /**
             * personal information agree check service
             *
             * su => signup
             */

            $scope.first_agree_check = false;
            $scope.second_agree_check = false;
            $scope.all_agree_check = false;

            $scope.allAgree = function () {

                console.log($scope.all_agree_check);

                if ($scope.all_agree_check === false) {

                    $scope.first_agree_check = false;
                    $scope.second_agree_check = false;

                } else {

                    $scope.first_agree_check = true;
                    $scope.second_agree_check = true;

                }
            };

            $scope.goSignupEvent = function () {
                if ($scope.first_agree_check === true && $scope.second_agree_check === true) {
                    $scope.pre_sign_page = 'si';
                    //sign in 창으로 이동 하게끔
                    $scope.sign_page = 'su';
                } else {
                    $ionicLoading.show({
                        template: '<i class="ion-checkmark-circled"></i> 모두 동의해주세요!'
                        , noBackdrop: true
                        , duration: 2000
                    });
                }
            };


            /**
             * signup service
             */

            $scope.signup = {
                signup_email: '',
                signup_subemail: '',

                signup_nickname: '',
                signup_nickname_check : true,
                signup_nickname_msg : '',

                signup_name: '',

                signup_pw: '',
                signup_pwcheck: '',
                signup_passwd_msg: false,

                signup_checkemail: '',

                signup_verify_code_server: '',
                signup_verify_code_front: '',
                signup_verify_code_check: false,

                signup_verify_code_check_msg: false
            };

            $rootScope.$on('pwstateChange', function (event, data) {
                $scope.signup.signup_passwd_msg = data;
            });

            $scope.signupemailCheck = function () {

                if ($scope.signup.signup_email.length === 0) {
                    var emailinput = angular.element('#emailinput');
                    emailinput.focus();
                    $ionicLoading.show({
                        template: '<i class="ion-checkmark-circled"></i> 이메일을 입력해주세요'
                        , noBackdrop: true
                        , duration: 2000
                    });
                } else {


                    signService.signCheckEmailRequest($scope.signup.signup_email, 'up').then(function (data) {
                        if (data === false) {
                            $scope.signup.signup_checkemail = 'duplicate';
                            var emailinput = angular.element('#emailinput');
                            emailinput.focus();
                        } else {
                            $scope.signup.signup_checkemail = 'available';
                            $ionicLoading.show({
                                template: '<i class="ion-checkmark-circled"></i> 메일로 인증코드를 전송하였습니다.'
                                , noBackdrop: true
                                , duration: 2000
                            });
                            $scope.signup.signup_verify_code_server = data;
                        }
                    })
                }


            };

            $scope.codeCheck = function () {

                console.log($scope.signup.signup_verify_code_front);

                var fc = $scope.signup.signup_verify_code_front.toUpperCase();
                var sc = $scope.signup.signup_verify_code_server.toUpperCase();

                $ionicLoading.show({
                    showBackdrop: false,
                    showDelay: 0,
                    template: '<ion-spinner icon="lines" class="spinner-assertive"></ion-spinner>'
                });
                $timeout(function () {
                    $ionicLoading.hide();

                    if (fc.length == '') {
                        $scope.signup.signup_verify_code_check_msg = true;

                    } else if (fc == sc) {
                        $scope.signup.signup_verify_code_check = true;
                        $scope.signup.signup_verify_code_check_msg = "";
                    } else {
                        $scope.signup.signup_verify_code_check_msg = true;
                    }
                }, 1000);

            };

            $scope.nicknameCheckEvent = function(){
                if($scope.signup.signup_nickname == ''){
                    $ionicLoading.show({
                        template: '닉네임을 입력해주세요<i class="ion-alert"></i> '
                        , noBackdrop: true
                        , duration: 1000
                    });
                }else{
                    signService.checkNicknameHttpRequest($scope.signup.signup_nickname).then(function(result){
                        $scope.signup.signup_nickname_check = result;
                        if(result == true){
                            $scope.signup.signup_nickname_msg = '';
                        }else{
                            $scope.signup.signup_nickname_msg = '이미 가입되어있는 닉네임이 있습니다.';
                        }
                    })
                }

            };

            $scope.codeChange = function () {
                $scope.signup.signup_verify_code_check = false;
                $scope.signup.signup_verify_code_check_msg = false;
            };

            $scope.signupComplete = function () {
                if ($scope.signup.signup_pw.length == 0) {
                    $ionicLoading.show({
                        template: '비밀번호를 입력해주세요<i class="ion-alert"></i> '
                        , noBackdrop: true
                        , duration: 2000
                    });
                } else {

                    signService.signupHttpRequest($scope.signup).then(function (sign_success_status) {
                        if (sign_success_status === true) {
                            /**
                             * 가입 성공
                             */

                            $ionicLoading.show({
                                showBackdrop: false,
                                showDelay: 0,
                                template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner>'
                            });
                            $timeout(function () {
                                $ionicLoading.hide();

                                //////////////////////// 가입 입력 ////////////////////////
                                $scope.signup.signup_email = '';
                                $scope.signup.signup_nickname = '';
                                $scope.signup.signup_name = '';

                                $scope.signup.signup_pw = '';
                                $scope.signup.signup_pwcheck = '';
                                $scope.signup.signup_passwd_msg = true;

                                $scope.signup.signup_checkemail = '';

                                $scope.signup.signup_verify_code_server = '';
                                $scope.signup.signup_verify_code_front = '';
                                $scope.signupsignup_verify_code_check = false;
                                $scope.signup.signup_verify_code_check_msg = false;

                                ////////////////////////정보동의 초기화 ////////////////////////
                                $scope.first_agree_check = false;
                                $scope.second_agree_check = false;
                                $scope.all_agree_check = false;

                                //////////////////////// 로그인 페이지로 전환 ////////////////////////
                                $scope.sign_page = 'si';

                            }, 1000);

                        } else {
                            /**
                             * 가입 실패
                             */
                            console.log('실패,,');
                        }
                    })

                }
            };


            /**
             *
             * find id/pw service
             *
             *
             */

            $scope.find = {
                find_subemail: '',
                find_name: '',
                find_email : '',
                find_pw_result : false
            };

            $scope.foundEmail = {};

            $scope.findemail = function () {
                signService.findEmailHttpRequest($scope.find).then(function (found_data) {

                    var starEmail = makeStar(found_data);
                    $scope.foundEmail = starEmail;
                });
            };

            $scope.findpassword = function(){
                signService.findPasswordHttpRequest($scope.find).then(function(found_result){
                    $scope.find.find_pw_result = found_result;
                })
            };

            /**
             * go back & refresh value
             */

            $scope.goBack = function () {

                $scope.find.find_subemail = '';
                $scope.find.find_name = '';
                $scope.find.find_pw_result = false;
                $scope.find.find_email = '';
                //////////////////////////////////////////////////////

                $scope.foundEmail = {};

                $scope.first_agree_check = false;
                $scope.second_agree_check = false;
                $scope.all_agree_check = false;

                //////////////////////////////////////////////////////
                $scope.signup.signup_email = '';
                $scope.signup.signup_nickname = '';
                $scope.signup.signup_name = '';

                $scope.signup.signup_pw = '';
                $scope.signup.signup_pwcheck = '';
                $scope.signup.signup_passwd_msg = true;

                $scope.signup.signup_checkemail = '';

                $scope.signup.signup_verify_code_server = '';
                $scope.signup.signup_verify_code_front = '';
                $scope.signupsignup_verify_code_check = false;
                $scope.signup.signup_verify_code_check_msg = false;

                $scope.sign_page = $scope.pre_sign_page;




            };
        }
    ]);

function makeStar(email) {

    var temp = [];
    for (var i in email) {

        var tempStr = email[i].email.split('@');

        var length = tempStr[0].length;

        var tempemail = tempStr[0];

        for (var j = length - 1; j >= length - 4; j--) {

            tempemail = tempemail.replaceAt(j, '*');

        }
        var tempre = tempemail.concat('@');
        var finish = tempre.concat(tempStr[1]);
        temp.push(finish);

    }
    return temp;

}
