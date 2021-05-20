## SecurityFirst 새싹챌린지 Season.1 최종버전(Back-End)

최종 수정 일시 : 2021-05-20

### 목차

1. 새싹챌 정보

2. 새싹챌 기능 설명

3. 사이트 보안성 

4. 개발 후기

### 1. 새싹챌 정보

소속 : 개발자들은 학술 동아리 SecurityFirst 이며 , 새싹챌도 SecurityFirst 소유

개발자 :  김승환 , 황영하

새싹 챌 계획 및 설계와 정식 개발 기간 : 1월 21일 ~ 3월 22일

사용 언어 : Node.Js express (100%)

사용한 라이브러리 : Sequelize , Passport , redis , bcrypt , multer , express-rate-limit , request-ip

서버 환경 : SecurityFirst 동아리 방 운영진 컴퓨터 windows 10 WSL2 (ubuntu 16.04)

### 2. 새싹챌 기능 설명

### /lectureimg        

담당 개발 : 김승환 , 황영하

새싹챌 이미지 , 강의 썸네일 이미지등을 모아놓은 곳 입니다.

***

### /middleware

담당 개발 : 김승환 , 황영하

백엔드 API에 요청하기전 확인해야 하는 중간 단계를 만들어 이를 거쳐 API에 요청하도록 middleware로 정리해 놓았습니다.

1. APILimit 
* Node.js 중 고유로 사용하는 메모리 저장소에 저장하여 시간에 따른 요청을 확인할 수 있는 'express-rate-limit'를 사용하여 기본을 구현하였습니다.

2. CheckLogin.js
* node.js 미들웨어 Passport를 사용하여 로그인을 구현하였으며 req.isAuthenticated() req.isNotLoggedIn() 으로 간단하게 로그인 된 사용자인지 아닌지 판별만 하는 미들웨어입니다.

3. ReturnUserInfo.js
* 로그인 한 사용자만 접근할 수 있는 페이지에 접근 할 때 로그인 한 사용자인지 아닌지에 대해서만 판별하는 간단한 미들웨어입니다.

4. Returnadmincheck.js
* admin 권한을 가진 사용자만 접근할 수 있는 페이지에 접근 할 때 해당 사용자가 admin의 권한을 가지고 있는지에 판별하는 미들웨어입니다. admin의 권한은 DB에 해당 유저의 permit 컬럼 값이 0인가 1인가로 나눕니다.

***

### /models

담당 개발 : 김승환 , 황영하

1. index.js
* Promise 기반으로 구현된 객체와 관계형 db의 데이터를 매핑 해주는 sequelize를 사용하였으며 Mysql 은 Mysql Workbench 8.0 을 이용해 관리합니다.

* 다음에 나오는 객체형 db로 만든 파일들을 mysql에 자동 매핑시켜주는 부분을 담당하는 중간 매개체 역할을 합니다.

```
    /lecture_comment.js == 강의 댓글
    /lecture_data.js == 강의 자료(파일) 모음
    /lecture_info.js == 강의 제목 , 강의 내용 글
    /lecture.js == 강의 종류

    /month_CTF.js == 이달의 CTF 정보
    /solver_table.js == 워 게임(모든 문제) 풀이자 정보
    /submit_history.js == 워 게임 인증 로그 정보
    /user_info.js == 유저 정보
    /wargame_info.js == 워 게임 정보
```

***
   
### /passport

담당 개발 : 김승환

==로그인 모듈 수정중==

***

### /profilepicture

담당 개발 : 김승환

* 로그인한 유저가 프로필 사진을 올릴시 모아두는 경로입니다.

***

### /routes

담당 개발 : 김승환 , 황영하

#### 새싹챌린지의 모든 API 기능을 처리해주는 가장 중요한 경로입니다.
#### 대부분의 API는 크게 API 실행과 API함수를 구현 해놓은 APIManage로 나뉩니다.

### /routes/Auth

담당 개발 : 김승환

* 로그인 되어있는지 판별하는 req.isAuthenticated() 사용하여 인증 여부를 판단합니다.

***

### /routes/Lecture

담당 개발 : 김승환

* SecurityFirst 기초교육 강의와 그 외 회원들이 자신이 알려주고 싶은 강의를 찍어 올릴 수 있는 게시판입니다. 강의는 관리자 권한을 가진 사람이 직접 올려줄 수 있음.

* Lecture.js 강의 쓰기 , 강의 수정 , 강의 삭제 , 카테고리 지정 , 강의 댓글 , 대댓글 요청 수정 등이 구현되어 있으며 요청받은 값에 의해 관리자 권한인지 일반 유저인지 NULL 값이 있는지 등에 대한 요청 확인 후 해당 API에서 필요로 하는 권한 and 값 검증이 확인 될 경우 해당 API에 맞는 기능을 실행하고 return 해주는 방식으로 되어 있습니다. 파일 업로드 및 강의 파일 수정은 multer의 single 과 fields를 사용,

* LectureFileDownload.js  파일 존재 여부 -> 파일명과 경로명 추출 -> setHeader 헤더 설정 -> CreateReadStream 파일 스트림 읽기모드 -> pipe 복사하여 넘겨줌

* LeactureManage.js 대댓글 구현 및 강의 게시판에 필요한 함수들이 구현되어 모듈화해서 모아놓은 파일

***

### /routes/Login

담당 개발 : 김승환

* Login.js 로그인 요청시 미들웨어에 만들어 둔 isNotLoggedIn을 통해 현재 비로그인 상태를 확인 후 PassPortHandler를 호출하여 로그인을 시도
* LoginManage.js 로그인 성공시 로그인 IP를 저장합니다. passport를 사용해 로그인을 처리합니다. , //AlreadyLoginHandler 미사용중

***

### /routes/Logout

담당 개발 : 김승환

* Logout.js 로그아웃 처리 요청하는 seesion 삭제

***

### /routes/Register

담당 개발 : 김승환 , 황영하

* Register.js 새싹챌 회원가입을 담당 /checkid /checkemail /checknick 모두 front-end에서 axios로 구현되어 실시간 입력시 요청하여 각 이름에 맞는 정규패턴식을 설정. 중복 이름이거나 정규패턴식에 어긋날 시 return 반환

* RegisterManage.js 회원가입란 각각에 대한 중복 or 공백을 확인하며 모두 통과하면 DB에 저장

***

### /routes/admin

담당 개발 : 황영하

* admin 확인 후 페이지 입장 , 유저 정보 목록 , 유저 정보 요청(수정 가능한 관리자 , 일반 사용자) , 워 게임 추가 수정 삭제 , 이달의 CTF 테이블 추가 수정 삭제
* adminmanage.js 유저 정보(수정 가능한 관리자) , 유저 업데이트 기능 (CRUD)
* CTFManage.js 이달의 CTF 관리(CRUD)

***

### /routes/myinfo

담당 개발 : 황영하

* myinfo.js 해당 세션을 갖고 있는 사용자의 내 정보 확인 , 내 정보 수정 , 다른 유저 검색 
* myinfomanage.js 내 정보 확인 , 내 정보 수정 요청

***

### /routes/rank

담당 개발 : 황영하

* rank.js 랭킹 요청
* rankmanage.js 관리자 권한을 가진 유저를 제외한 유저들의 점수 내림차순으로 보여줌과 내 정보 요청 시 보여줄 내 점수

***

### /routes/users

담당 개발 : 황영하

* users.js 유저 정보 테이블 요청
* usersmanage.js 유저 정보 확인

***

### /routes/wargame

담당 개발 : 황영하

* wargame_info.js 워게임들에 대한 필요한 API를 담고 있으며 Front-End 워게임 댓글은 미구현 상태
* wargameFileDownload.js 워 게임 파일은 여러 파일을 올리는 것이 아닌 하나의 zip 파일로 압축해서 올리므로 하나만 편하게 다운받을 수 있음
* wargameManage.js 워 게임 관리(CRUD)에 대한 함수 기능들과 그 외 필요한 함수 들어 있으며 플래그는 bcrypt로 암호화하여 비교합니다. 

***





### 3. 사이트 보안성

| 공격 가능성                              |    보안성    |
|:------------------------------------|:---:|
| SQL injection | 바인딩 데이터를 사용하는 Sequelize와 암호화 모듈 bcrypt를 사용 |
| API 지속 요청 | 시간에 따른 API 요청을 확인하여 제한할 수 있는 express-rate-limit 사용|
| 파일 업로드   | Node.Js는 라우팅 가능한 경로에서 접근이 가능 + 파일 확장자 검사 |
| admin 페이지 요청   | 권한이 없는 사용자는 접근할 수 없게 막혀있으며 이를 조작하려면 SQL injection을 할 수 있어야함. |

2021 03-21 부터 베타 오픈하여 동아리원들이 이용하며 버그 및 취약점 발견시 제보를 받고 있음.

2021 05-20 기준 1건 발견

보안 취약점 패치 내용(FE , BE)

2021-03-23 front-end 에서 취약한 Markdown 사용 결과 xss 공격에 성공한 적이 있음.

공격 코드 : <iframe src=javascript:parent.document.getElementsByTagName('body')[0].innerHTML="hackedByCodstice"> 

조치 : 당시 사용하던 MarkDown에 iframe 공격만 허용이 되었고, iframe 태그를 사용하지 못하게 필터링 하였음.

***
    
### 4. 개발 후기
    
**김승환** : 
   
**황영하** : 첫 협업 개발이라 미흡한점이 많았고 앞으로 개선할 점도 많이 배웠습니다. 또한 개발하면서 node의 동작 원리를 같이  재밌었습니다.
    
    

