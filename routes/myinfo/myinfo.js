const express = require("express");
const router = express.Router();
const rankManage = require("./../rank/rankmanage");
const Myinfomanage = require("./myinfomanage");


router.get("/myinfo", async (req, res, next) => {
    try {
        console.log(1234)
        if(req.user.ID){
            console.log(1234)   
            const apimyinfo = await Myinfomanage.myinfomanage(req);
            
            if (apimyinfo) {
  //              myinfo["solves"][0].ChCategory
  const Categories={"WEB":0,"REV":0,"PWN":0,"FOR":0,"CRY":0}
 for(let key in apimyinfo["solves"]) {
     if((key, apimyinfo["solves"][key].ChCategory)=="WEB")   Categories.WEB+=1
     else if((key, apimyinfo["solves"][key].ChCategory)=="REV") Categories.REV+=1
     else if((key, apimyinfo["solves"][key].ChCategory)=="PWN") Categories.PWN+=1
     else if((key, apimyinfo["solves"][key].ChCategory)=="FOR") Categories.FOR+=1
     else if((key, apimyinfo["solves"][key].ChCategory)=="CRY") Categories.CRY+=1
     
 }
              const myinfo=apimyinfo.myinfo
              const returnmyinfo={myinfo,Categories};
              return res.status(200).send(returnmyinfo);
            } else {
                return res.status(200).send('{"Error":"no data"}');
            }
        }
        else{
            return res.status(200).send('{"Error":"not user"}');
        }
       
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});
router.post("/myinfoupdate", async(req,res,next)=>{
    try{
    if (!req.body.PassWord){
        console.log('here');
        await Myinfomanage.myinfoupdate(req);
        return res.status(201).send('{"Result":"OK"}');
    }
    else if(req.user.PassWord<8 || req.user.Password>20){
        return res.status(200).send('{"Result" : "Fail"}');
    }
    else if(req.user.password>=8 || req.user.Password<=20){
        await Myinfomanage.myinfoupdatepw(req);
        return res.status(201).send('{"Result":"OK"}');
    }
    }
    catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
})

module.exports = router;
