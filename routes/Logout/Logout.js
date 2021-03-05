const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../../middleware/CheckLogin");
const router = express.Router();

router.get("/", (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).send('{"Result" : "Fail"}');
});

module.exports = router;
