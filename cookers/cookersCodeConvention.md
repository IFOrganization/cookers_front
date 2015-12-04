#IF Code convention
---

##변수의 정의
* 사용하고자 하는 변수가 단일 변수인 경우
	* _의 사용을 통해서 의미단위로 끊어준다
		ex) find_id , find_password
* 사용하고자 하는 변수가 여러개의 항목을 담고있어야 하는 경우
	* json 형식으로 맞추어 준다. json object의 이름은 _제외.
		ex) 회원가입의 경우 
        
        ```javascript
        	var signin = {};
            signin.signin_email = '';
            signin.signin_password = '';
            /*
            	signin = {
                	signin_email : '',
                    signin_passwd : ''
                }
                의 형식을 맞춰 사용
            */
        ```
        
## 함수명의 정의
* 함수 이름의 정의는 의믜단위로 대문자를 사용하여 나누어준다
	ex) email중복 체크 메소드
        
        
        function emailDuplicationCheck(sign_id){
            //something to do
        }
    
    
## 파일생성 & 파일명 & 모듈명 정하기

* front
	* service, directive, filter 처럼 큰 기능은 앞에 대문자를 사용하여 뒤에 모두 적는다

		ex) passwordcheckDirective, cameraDirective etc ... 

	* 모듈명 또한 풀네임으로 사용 (directive나 filter는 의미가 명확하게 이름을 만들기)

		ex) showrecipeController, writeService( $의 사용은 외부 모듈 의존성 주입시 햇갈리는 문제때문에 ... )
        (directive - addressFind , duplicationCheckPassword etc ...)

* backend

	* route는 하위 디렉토리에서 이름+Route방식으로 사용

		ex ) routes -> memberRoute
        
    * 파일명은 대문자를 사용하여 의미 부여

		ex ) mailService.js , errorHandling.js
        
	* 설치한 모듈은 package.json에 명시 해야하고 필요한 부분에서 로드하여 사용
	* 비지니스 로직은 기능별로 한곳에 모아서 처리
		ex ) 정규표현식을 위한 것들은 reg.js 파일로 만들어 한곳에서 처리

## 이외의 것들

* 기본적인 문법은 개인이 사용하는 방식을 가지고 최대한 편하게 코딩 (for, if 문등...)
* 주석은 초록색으로 나오는 주석에 변수명 함수의 기능들을 정리


##FRONT-END 코딩 지침

### * 이 문서를 기준으로 Front-end 파일들을 작성하고 코딩한다.               


### * 파일 디렉터리 설명 (기준 : cookers_front/cookers/www)  

    
    - views : 템플릿들이 모여있는 디렉터리
    - js : javascript파일들이 모여있는 디렉터리
    - css : stylesheet 파일들이 모여있는 디렉터리   
    
    프로젝트 디렉터리는 크게 위 3개로 분류되며 내부에 기능별 디렉터리들을 가지고 있다. 예를 들어
    
    ~/css/home
    
    ~/css/search
    
    ~/css/cooksummary
    
    ~/css/notice
    
    ~/css/user
    
    
    위와 같이 각 기능별로 디렉터리가 또 다시 나누어져 있으며 본인이 맡은 part의 파일을 생성하여 코딩하면 된다.
    
    (js디렉터리의 경우 controllers 디렉터리에만 기능별 분류를 하였다)
    
### * 외부 모듈의 경우 lib/external 디렉터리에 필요 파일을 추가하면 된다. 이 때 본인이 주입하는 모듈의 이름으로 디렉터리를 생성하여 js파일과 css파일을 추가한다.
    ex> lib/external/angular-gmap/angular-gmap.js
    lib/external/angular-gmap/angular-gmap.css
            
위와 같은 방식으로 파일을 추가한다.
    
### ** 접두어에 test가 붙은 파일들은 git에 push하기 위한 용도 이므로 삭제하고 본인의 파일을 만들면 된다.