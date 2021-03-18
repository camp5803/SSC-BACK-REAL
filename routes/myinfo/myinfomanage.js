const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const LoginManage = require("./../Login/LoginManage");
const wargame_info = require("../../models/wargame_info");
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("saessak", "saessakdb", "~!saessak2021~!", {
    host: "211.229.250.147",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

exports.myinfomanage = async function myinfomanage(req) {
    try {
        ID = req.user.ID;
        const myinfo = await user_info.findOne({
            where: { ID },
            attributes: [
                "Nick",
                "profilepicture",
                "Comment",
                "Name",
                "StudentID",
                "Email",
                "belong",
                "Score"
            ]
        });

        const solves = await solver_table.findAll({
            where: { ID },
            attributes: ["ChID", "ChCategory"]
        });

        if (!solves) {
            return {
                myinfo: myinfo,
                solves: 0
            };
        }

        const solvelist = await sequelize.query(
            "SELECT ChTitle,ChCategory,ChScore FROM wargame_info WHERE ChID in (SELECT ChID FROM solver_table where ID = ?)",
            {
                replacements: [req.user.ID],
                type: QueryTypes.SELECT
            }
        );

        return {
            myinfo: myinfo,
            solves: solves,
            solvelist: solvelist
        };
    } catch (err) {
        console.log(err);
    }
};
exports.myinfoupdate = async function myinfoupdate(req) {
    try {
        ID = req.user.ID;
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
            { where: { ID } }
        );
    } catch (err) {
        console.log(err);
    }
};
exports.myinfoupdatepw = async function myinfoupdatepw(req) {
    const { PassWord } = req.body;
};
