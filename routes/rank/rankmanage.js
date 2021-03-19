const user_info = require("../../models/user_info");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.rank = async function rank(req) {
    try {
        const ranklist = await user_info.findAll({ where: { permit: 0 } });

        if (!ranklist) {
            return res.status(200).send('{"Error" : "No Data"}');
        }

        if (ranklist) {
            const rankorder = await user_info.findAll({
                where: { permit: 0, Score: { [Op.ne]: 0 } },
                attributes: ["Nick", "Comment", "Score", "solved_at"],
                order: [
                    ["Score", "DESC"],
                    ["solved_at", "ASC"]
                ]
            });
            return rankorder;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return res.status(200).send('{"Error" : "Wrong"}');
    }
};
exports.myrank = async function myrank(req) {
    try {
        const myranklist = await user_info.findAll({ where: { permit: 0 } });

        if (!myranklist) {
            return res.status(200).send('{"Error" : "No Data"}');
        }

        if (myranklist) {
            const myrankorder = await user_info.findAll({
                where: { permit: 0, Score: { [Op.ne]: 0 } },
                attributes: ["ID", "Score"],
                order: [
                    ["Score", "DESC"],
                    ["solved_at", "ASC"]
                ]
            });
            return myrankorder;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return res.status(200).send('{"Error" : "Wrong"}');
    }
};
