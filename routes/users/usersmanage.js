const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const LoginManage = require("../Login/LoginManage");
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
    logging: false,
    operatorsAliases: false
});

exports.myinfomanage = async function myinfomanage(req) {
    try {
        const name = req.params.name;

        const myinfo = await user_info.findOne({
            where: { Nick: name },
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
            where: { Nick: name },
            attributes: ["ChID", "ChCategory"]
        });
        if (!solves) {
            return {
                myinfo: myinfo,
                solves: 0
            };
        }

        const solvelist = await sequelize.query(
            "SELECT ChTitle,ChCategory,ChScore FROM wargame_info WHERE ChID in (SELECT ChID FROM solver_table where Nick = ?)",
            {
                replacements: [name],
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
