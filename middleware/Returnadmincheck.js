exports.Returnadmincheck = (req, res) => {
    const { ID } = req.user
    const returnadmin = user_info.findOne({ where: { ID } });
    if(returnadmin.permit) { return false; }
    else return true;
};