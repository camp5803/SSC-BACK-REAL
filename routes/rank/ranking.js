const express = require("express");
const rankManage = require("./rankmanage");
const router = express.Router();
const { isLoggedIn } = require("../../middleware/CheckLogin");
router.use(isLoggedIn); // 로그인 확인
router.get("/getrank", async (req, res, next) => {
    try {
        const rank = await rankManage.rank();
        return res.status(200).send(rank);
    } catch (err) {
        return res.status(400).send('{"Error" : "Fail"}');
    }
});

<<<<<<< HEAD
=======
router.get("/", async (req, res, next) => {
    res.send("asdffff");
});
>>>>>>> c7721b7fc2957243d6c84701c9adcc8a14eba8ea
module.exports = router;
