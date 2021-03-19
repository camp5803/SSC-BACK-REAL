const LoginManage = require("../routes/Login/LoginManage");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(200).send('{"Error" : "Not Logged in"}');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        console.log("already");
        req.logout();
        req.session.destroy();
        res.clearCookie("connect.sid");
        LoginManage.AlreadyLoginHandler(req, res, next);
    }
};
