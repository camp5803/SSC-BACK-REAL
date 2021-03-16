const express = require("express");
const rankManage = require("./rankmanage");
const router = express.Router();
router.get("/getrank", async (req, res, next) => {
    try {
        const rank = await rankManage.rank();
        return res.status(200).send(rank);
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});

router.get("/",async(req,res,next)=>{
    res.send('asdffff');
})
module.exports = router;
