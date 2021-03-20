
const { ReturnUserInfo } = require("../../middleware/ReturnUserInfo")
const permit  = require("../../middleware/Returnadmincheck")
const express = require('express')
const requestIp = require('request-ip')
const router = express.Router();
const wargameManage=require('./../wargame/wargameManage')
const rankManage=require('./../rank/rankmanage')
const user_info = require("../../models/user_info");
const month_CTF = require("../../models/month_CTF");
const adminManage  = require("./adminManage")
const CTFManage = require("./CTFManage");

/// admin 확인 후 입장
router.get('/', async   (req,res,next)=>{
    try{      
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (await permit.Returnadmincheck(req)){
            return res.status(400).send('{"Error" : "Not Page"}');
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
                return res.status(400).send('{"Error" : "Not Page"}');
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
                return res.status(400).send('{"Error" : "Not Page"}');
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
            return res.status(400).send('{"Error" : "Not Page"}');
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
        return res.status(400).send('{"Error" : "Not Page"}');
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
            return res.status(400).send('{"Error" : "Not Page"}');
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
            return res.status(400).send('{"Error" : "Not Page"}');
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


// CTF 정보 목록 테이블
router.post('/CTF', async(req,res,next)=>{
    try{
            if (wargameManage.CheckWrongAccess(req)) {
                return res.status(400).send('{"Error" : "Wrong Access"}');
            }   
            if (await permit.Returnadmincheck(req)){
                return res.status(400).send('{"Error" : "Not Page"}');
            }  
            console.log("month") 
            userinfo = await user_info.findAll();
            console.log(userinfo)
            month = await month_CTF.findAll();
            console.log("month")    
            if (month) {
                return res.status(200).send(JSON.stringify(month)); 
            }
            else { return res.status(400).send('{"Error" : "No CTF"}'); }
        }
            catch (error) {
                console.error(error)
                return res.status(200).send('{"Error" : "Wrong"}')
            }
})
// CTF 정보 추가
router.post('/api/CTFadd', async(req,res,next)=>{
    try{
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (permit.Returnadmincheck()){
            return res.status(400).send('{"Error" : "Not Page"}');
        }   
        if (CTFManage.CheckNull(req)) {
            return res.status(400).send('{"Error" : "Find Null"}');
        }
        if (await CTFManage.CTF_upload(req)){
            return res.status(201).redirect("/");
        };
    }
    catch(error){
        console.error(error)
        return res.status(200).send('{"Error" : "Wrong"}')
    }  
    
})
// CTF 수정
router.post('/api/CTFmodify', async(req,res,next)=>{
        try{
            if (wargameManage.CheckWrongAccess(req)) {
                return res.status(400).send('{"Error" : "Wrong Access"}');
            }
            if (permit.Returnadmincheck()){
                return res.status(400).send('{"Error" : "Not Page"}');
            }   
            if (CTFManage.CheckNull(req)) {
                return res.status(400).send('{"Error" : "Find Null"}');
            }
            if (await CTFManage.CTFupdate(req)){
                return res.status(201).redirect("/");
            };
        }
        catch(error){
            console.error(error)
            return res.status(200).send('{"Error" : "Wrong"}')
        }  
        
})
// CTF 삭제
router.post('/api/CTFdelete', async(req,res,next)=>{
    try{
        if (wargameManage.CheckWrongAccess(req)) {
            return res.status(400).send('{"Error" : "Wrong Access"}');
        }
        if (permit.Returnadmincheck()){
            return res.status(400).send('{"Error" : "Not Page"}');
        }   
        if (CTFManage.pdelete(req)) {
            return res.status(400).send('{"Error" : "Find Null"}');
        }
    }
    catch(error){
        console.error(error)
        return res.status(200).send('{"Error" : "Wrong"}')
    }  
    
})

module.exports = router
