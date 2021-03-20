const express = require("express");
const router = express.Router();
const rankManage = require("./../rank/rankmanage");
const Myinfomanage = require("./myinfomanage");

router.get("/", async (req, res, next) => {
    try {
        if (!req.user.ID){
            //방어
        }
        if (req.user.ID) {
            const apimyinfo = await Myinfomanage.myinfomanage(req);
            if (apimyinfo) {
                //              myinfo["solves"][0].ChCategory
                const Categories = {
                    WEB: 0,
                    REV: 0,
                    PWN: 0,
                    FOR: 0,
                    CRY: 0,
                    MISC: 0
                };
                for (let key in apimyinfo["solves"]) {
                    if ((key, apimyinfo["solves"][key].ChCategory) == "WEB")
                        Categories.WEB += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "REV"
                    )
                        Categories.REV += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "PWN"
                    )
                        Categories.PWN += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "FOR"
                    )
                        Categories.FOR += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "CRY"
                    )
                        Categories.CRY += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "MISC"
                    )
                        Categories.MISC += 1;
                }
                const myinfo = apimyinfo.myinfo;
                const solvelist = apimyinfo.solvelist;
                const returnmyinfo = { myinfo, Categories, solvelist };
                return res.status(200).send(returnmyinfo);
            } else {
                return res.status(200).send('{"Error":"no data"}');
            }
        } else {
            return res.status(200).send('{"Error":"not user"}');
        }
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});


router.post("/myinfoupdate", async (req, res, next) => {
    try {
        if (req.body.Comment) {
            if (req.body.Comment.length <= 50) {
                const Result = await Myinfomanage.myinfoupdate(req);
                if (Result) {
                    return res.status(201).send('{"Result":"OK"}');
                }
            } else {
                return res.status(201).send('{"Result":"Wrong Length"}');
            }
        } else {
            return res.status(201).send('{"Result":"Fail"}');
        }
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});

router.get("/:name", async (req, res, next) => {
    try {
        const name = req.params.name;
        if (!req.user.ID){
            //방어
        }
        if (req.user.ID) {
            console.log(name)
            console.log(req.user.ID)
            const apimyinfo = await Myinfomanage.myinfomanage(name);
            console.log(apimyinfo)
            if (apimyinfo) {
                //              myinfo["solves"][0].ChCategory
                const Categories = {
                    WEB: 0,
                    REV: 0,
                    PWN: 0,
                    FOR: 0,
                    CRY: 0,
                    MISC: 0
                };
                for (let key in apimyinfo["solves"]) {
                    if ((key, apimyinfo["solves"][key].ChCategory) == "WEB")
                        Categories.WEB += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "REV"
                    )
                        Categories.REV += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "PWN"
                    )
                        Categories.PWN += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "FOR"
                    )
                        Categories.FOR += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "CRY"
                    )
                        Categories.CRY += 1;
                    else if (
                        (key, apimyinfo["solves"][key].ChCategory) == "MISC"
                    )
                        Categories.MISC += 1;
                }
                const myinfo = apimyinfo.myinfo;
                const solvelist = apimyinfo.solvelist;
                const returnmyinfo = { myinfo, Categories, solvelist };
                return res.status(200).send(returnmyinfo);
            } else {
                return res.status(200).send('{"Error":"no data"}');
            }
        } else {
            return res.status(200).send('{"Error":"not user"}');
        }
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});






module.exports = router;
