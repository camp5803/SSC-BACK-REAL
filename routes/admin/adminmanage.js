const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const LoginManage = require("../Login/LoginManage");
exports.user = async function user(req) {
    try {
        const ID = req.body.ID;
        const userinfo = await user_info.findOne({
            where: { ID },
            attributes: [
                "UserNumber",
                "ID",
                "Belong",
                "StudentID",
                "Name",
                "Nick",
                "Email",
                "LastIp",
                "Comment",
                "Score",
                "created_at",
                "solved_at"
            ]
        });
        const usersolves = await solver_table.findAll({
            where: { ID },
            attributes: ["ChID", "ChCategory"]
        });
        if (!usersolves) {
            return {
                userinfo: userinfo,
                solves: 0
            };
        }

        return {
            userinfo: userinfo,
            solves: usersolves
        };
    } catch (err) {
        console.log(err);
    }
};

exports.myinfoupdate = async function myinfoupdate(req) {
    try {
        const userID = req.body.ID;
        //await LoginManage.WriteLastIP(req); 합병하면 푸셈
        const { Nick, Comment, Name, StudentID, Email, Belong } = req.body;
        await user_info.update(
            {
                Nick,
                Comment,
                Name,
                StudentID,
                Email,
                Belong
            },
            { where: { ID: userID } }
        );
    } catch (err) {
        console.log(err);
    }
};
