
const { ReturnUserInfo } = require("../../middleware/ReturnUserInfo")
const permit  = require("../../middleware/Returnadmincheck")
const express = require('express')
const requestIp = require('request-ip')
const router = express.Router();
const wargameManage=require('./../wargame/wargameManage')
const rankManage=require('./../rank/rankmanage')
const user_info = require("../../models/user_info");
const adminManage  = require("./adminManage")

/// admin 확인 후 입장
router.get('/', async   (req,res,next)=>{
    try{      
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (await permit.Returnadmincheck(req)){
            return res.status(400).send('{"Error" : "Not admin"}');
        }   
        return res.status(200).send('{"Result" : "Hi Admin~"}');
    }
    catch(error){
        console.error(error)
        return res.status(200).send('{"Error" : "Wrong"}')
    }  
})

// 유저 정보 목록 테이블
router.post('/userinfo', async(req,res,next)=>{
    try{
            if (wargameManage.CheckWrongAccess(req)) {
                return res.status(400).send('{"Error" : "Wrong Access"}');
            }   
            if (await permit.Returnadmincheck(req)){
                return res.status(400).send('{"Error" : "Not admin"}');
            }   
            userinfo = await user_info.findAll();
            if (userinfo) {
                return res.status(200).send(JSON.stringify(userinfo)); 
            }
            else { return res.status(400).send('{"Error" : "No user"}'); }
        }
            catch (error) {
                console.error(error)
                return res.status(200).send('{"Error" : "Wrong"}')
            }
})

// 유저 정보 요청
router.post('/user', async(req,res,next)=>{
    try{
            if (wargameManage.CheckWrongAccess(req)) {
                return res.status(400).send('{"Error" : "Wrong Access"}');
            }
            if (await permit.Returnadmincheck(req)){
                return res.status(400).send('{"Error" : "Not admin"}');
            } 
            
            const apimyinfo = await adminManage.user(req);
            
            if(apimyinfo){
                const Categories={"WEB":0,"REV":0,"PWN":0,"FOR":0,"CRY":0,"MISC":0}
    for(let key in apimyinfo["solves"]) {
        if((key, apimyinfo["solves"][key].ChCategory)=="WEB")   Categories.WEB+=1
        else if((key, apimyinfo["solves"][key].ChCategory)=="REV") Categories.REV+=1
        else if((key, apimyinfo["solves"][key].ChCategory)=="PWN") Categories.PWN+=1
        else if((key, apimyinfo["solves"][key].ChCategory)=="FOR") Categories.FOR+=1
        else if((key, apimyinfo["solves"][key].ChCategory)=="CRY") Categories.CRY+=1 
        else if((key, apimyinfo["solves"][key].ChCategory)=="MISC") Categories.MISC+=1      
        }
              const myinfo=apimyinfo.userinfo
              const returnmyinfo={myinfo,Categories}; 
              return res.status(200).send(returnmyinfo);
            }
        }
            catch (error) {
                console.error(error)
                return res.status(200).send('{"Error" : "Wrong"}')
            }
})

// 유저 정보 수정
router.post('/userinfoupdate', async(req,res,next)=>{
    try{
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (await permit.Returnadmincheck(req)){
            return res.status(400).send('{"Error" : "Not admin"}');
        } 
        if (req.body){  
            await adminManage.myinfoupdate(req);
            return res.status(201).send('{"Result":"OK"}');
        }
        }
        catch(error){
            console.log(error)
            return res.status(200).send('{"Error" : "Wrong"}')
        }
})




// 워게임 추가
router.post('/api/wargameadd', async(req,res,next)=>{
try{
    if (wargameManage.CheckWrongAccess(req)) {
        return res.status(400).send('{"Error" : "Wrong Access"}');
    }
    if (permit.Returnadmincheck()){
        return res.status(400).send('{"Error" : "Not admin"}');
    }   
    if (wargameManage.CheckNull(req)) {
        return res.status(400).send('{"Error" : "Find Null"}');
    }
    if (await wargameManage.wargame_upload(req)){
        return res.status(201).redirect("/");
    };
}
catch(error){
    console.error(error)
    return res.status(200).send('{"Error" : "Wrong"}')
}  

})
// 워게임 수정
router.post('/api/wargamemodify', async(req,res,next)=>{
    try{
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (permit.Returnadmincheck()){
            return res.status(400).send('{"Error" : "Not admin"}');
        }   
        if (wargameManage.CheckNull(req)) {
            return res.status(400).send('{"Error" : "Find Null"}');
        }
        if (await wargameManage.wargame_update(req)){
            return res.status(201).redirect("/");
        };
    }
    catch(error){
        console.error(error)
        return res.status(200).send('{"Error" : "Wrong"}')
    }  
    
})
// 워게임 삭제
router.post('/api/wargamedelete', async(req,res,next)=>{
    try{
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (permit.Returnadmincheck()){
            return res.status(400).send('{"Error" : "Not admin"}');
        }   
        if (wargameManage.pdelete(req)) {
            return res.status(400).send('{"Error" : "Find Null"}');
        }
        if (await wargameManage.wargame_update(req)){
            return res.status(201).redirect("/");
        };
    }
    catch(error){
        console.error(error)
        return res.status(200).send('{"Error" : "Wrong"}')
    }  
    
})

router.get('/rank', async(req,res,next)=>{
    try {   
        const rank = await rankManage.rank();
        res.send(JSON.stringify(rank));
        
            return res.status(200).send('{"Error":"no data"}') 
        }
    catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
})




module.exports = router
