const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const LoginManage = require("./../Login/LoginManage");
exports.user = async function user(req) {
    try {

        ///작업중
        const userID= req.body.userID;
        const userinfo = await user_info.findOne({ where:  {userID} , attributes: ["UserNumber","ID","Belong","StudentID","Name","Nick","Email"," LastIp","Comment","Score","created_at","solved_at"] });
        const usersolves = await solver_table.findAll({ where: {userID}, attributes: ["ChID","ChCategory"] });
        if (!usersolves) {
            return {
                myinfo: userinfo,
                solves: 0
            }
        }
                return {    
                    myinfo: userinfo,
                    solves: solves
                };
        }
        catch (err) {
        console.log(err);
    }
};