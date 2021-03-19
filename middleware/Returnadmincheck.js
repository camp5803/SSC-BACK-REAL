const user_info = require("../models/user_info");

exports.Returnadmincheck = async function submitflag(req) {
    const { ID } = req.user;
    const returnadmin = await user_info.findOne({ where: { ID } });
    if (returnadmin.permit) {
        return 0;
    } else return 1;
};
