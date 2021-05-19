ㅁㄴㅇㅁㄴㅇ

# SSC-BACK-REAL


/lectureimg                                      
담당 : 김승환 , 황영하
새싹챌 이미지 , 강의 썸네일 이미지등을 모아놓은 곳 입니다.

***

/middleware
담당 : 김승환 , 황영하

>백엔드 API에 요청하기전 확인해야 하는 중간 단계를 만들어 이를 거쳐 API에 요청하도록 middleware로 정리해 놓았습니다.

>* 확인 4가지
>1. APILimit 
>* Node.js 중 고유로 사용하는 메모리 저장소에 저장하여 시간에 따른 요청을 확인할 수 있는 'express-rate-limit'를 사용하여 기본을 구현하였습니다.
>2. CheckLogin.js
>* node.js 미들웨어 Passport를 사용하여 로그인을 구현하였으며 req.isAuthenticated() req.isNotLoggedIn() 으로 간단하게 로그인 된 사용자인지 아닌지 판별만 하는 미들웨어입니다.
>3. ReturnUserInfo.js
>* 로그인 한 사용자만 접근할 수 있는 페이지에 접근 할 때 로그인 한 사용자인지 아닌지에 대해서만 판별하는 간단한 미들웨어입니다.
>4. Returnadmincheck.js
>* admin 권한을 가진 사용자만 접근할 수 있는 페이지에 접근 할 때 해당 사용자가 admin의 권한을 가지고 있는지에 판별하는 미들웨어입니다. admin의 권한은 DB의 permit 컬럼이 0인가 1인가로 나눕니다.


/models

***
***
***
***
***
***
***
***
***
***
