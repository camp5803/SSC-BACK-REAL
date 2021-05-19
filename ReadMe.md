## SecurityFirst 새싹챌린지 Season.1 최종버젼(Back-End)

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

==수정 중==

***

### /profilepicture

담당 개발 : 김승환

* 로그인한 유저가 프로필 사진을 올릴시 모아두는 경로입니다.

***

### /routes

담당 개발 : 김승환 , 황영하

#### 새싹챌린지의 모든 API 기능을 처리해주는 가장 중요한 경로입니다.

### /routes/Auth

담당 개발 : 김승환

* 로그인 되어있는지 판별하는 req.isAuthenticated() 사용하여 인증 여부를 판단합니다.

***

### /routes/Lecture

담당 개발 : 김승환

==수정 중==

***

### /routes/Login

담당 개발 : 김승환

==수정 중==

***

### /routes/Logout

담당 개발 : 김승환

==수정 중==

***

### /routes/Register

담당 개발 : 김승환 , 황영하

==수정 중==

***

### /routes/admin

담당 개발 : 김승환 , 황영하

==수정 중==

***

### /routes/myinfo

담당 개발 : 황영하

==수정 중==

***

### /routes/rank

담당 개발 : 황영하

==수정 중==

***

### /routes/users

담당 개발 : 황영하

==수정 중==

***

### /routes/wargame

담당 개발 : 김승환 , 황영하

==수정 중==

***





### 3. 사이트 보안성

| 공격 가능성                              |    보안성    |
|:------------------------------------|:---:|
| SQL injection | 바인딩 데이터를 사용하는 Sequelize+bcrypt를 사용 |
| API 지속 요청 | 시간에 따른 API 요청을 확인하여 제한할 수 있는 express-rate-limit 사용|
| 파일 업로드   | Node.Js는 라우팅 가능한 경로에서 접근이 가능 + 파일 확장자 검사 |

그 외 보안 취약점 패치 내용(FE , BE)

2021-03-23 front-end 에서 취약한 Markdown 사용 결과 library 에 xss 공격에 성공한 적이 있음.

공격 코드 : <iframe src=javascript:parent.document.getElementsByTagName('body')[0].innerHTML="hackedByCodstice"> 

조치 : 당시 사용하던 MarkDown에 iframe 공격만 허용이 되었고, toast editor 로 교체 하였음.





***
    
### 4. 개발 후기
    
> 김승환 : 
   
> 황영하 : 
    
    

