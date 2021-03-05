const { ReturnUserInfo } = require("../../middleware/ReturnUserInfo")
const { permit } = require("../../middleware/Returnadmincheck")
const express = require('express')
const requestIp = require('request-ip')
const router = express.Router();
const wargameManage=require('./../wargame/wargameManage')
const rankManage=require('./../rank/rankmanage')

/// 문제들 목록 데이터 가져오는 API
router.get('/', async(req,res,next)=>{
    try {   
        const rank = await rankManage.rank();
        res.send(JSON.stringify(rank));
        
            return res.status(200).send('{"Error":"no data"}') 
        }
    catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
})
// 유저 정보 목록 테이블
router.post('/api/userinfo', async(req,res,next)=>{
    try{
        //exports.datalist = async function datalist() {
          //  try {
                const userinfo = await user_info.findAll()
                if (userinfo) { return JSON.stringify(userinfo); }
                else { return false; }
            }
            catch (error) {
                console.error(error)
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
