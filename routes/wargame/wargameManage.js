const { ReturnUserInfo } = require("../../middleware/ReturnUserInfo");
const wargame_info = require("../../models/wargame_info");
const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const lecture_comment = require("../../models/lecture_Comment");
const submit_history = require("../../models/submit_history");
const rankManage = require("./../rank/rankmanage");
const requestIp = require("request-ip");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

exports.SetMulter = function SetMulter() {
    return multer({
        storage: multer.diskStorage({
            destination(req, file, done) {
                done(null, "/mnt/c/SSC-back-master/uploads");
            },
            filename(req, file, done) {
                const ext = path.extname(file.originalname);
                done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 }
    });
};

exports.proinfo = async function proinfo(req) {
    const { ID } = req.user;

    const proinfo = await solver_table.findAll({
        where: { ID },
        attributes: ["ChID"]
    });
    let Data = [];
    if (!proinfo) {
        return false;
    } else {
        proinfo.map(item => {
            Data.push(item.dataValues.ChID);
        });
        return Data;
    }
};

exports.submitflag = async function submitflag(req) {
    try {
        if (!req.user.ID) {
            return false;
        }
        const { Flag, ChID } = req.body;
        if (!Flag || !ChID) {
            return false;
        }
        const SaveHistory = await submit_history.create({
            ID: req.user.ID,
            ChID: ChID,
            Contents: Flag,
            created_at: Date.now()
        });
        if (!SaveHistory) {
            return false;
        }
        const pro_salt = await wargame_info.findOne({
            where: { ChID },
            attributes: ["ChSalt"]
        });
        const hash = bcrypt.hashSync(Flag, pro_salt.ChSalt);

        const pro_flag = await wargame_info.findOne({
            where: { ChFlag: hash },
            attributes: ["ChID", "ChFlag", "ChScore", "ChCategory", "ChSolver"]
        });
        if (!pro_flag) {
            return false;
        }
        if (!pro_flag.ChFlag) {
            return false;
        }
        if (pro_flag.ChFlag !== hash) {
            return false;
        }
        if (pro_flag.ChFlag === hash) {
            const { ID } = req.user;

            const overlap = await solver_table.findOne({
                where: { ChID: pro_flag.ChID, ID }
            }); //???????????? ??????

            if (overlap) {
                return false;
            } else {
                const SScore = await user_info.findOne({
                    where: { ID },
                    attributes: ["Score"]
                });

                await user_info.update(
                    // ?????? ?????? ?????? + ?????? ?????? ??????
                    {
                        Score: SScore.Score + pro_flag.ChScore,
                        solved_at: Date.now()
                    },
                    {
                        where: { ID: ID },
                        solved_at: Date.now()
                    }
                );
                await solver_table.create({
                    ChID: pro_flag.ChID,
                    ID,
                    Nick: req.user.Nick,
                    created_at: Date.now(),
                    ChCategory: pro_flag.ChCategory
                });
                await wargame_info.update(
                    // ??? ?????? ??????+1
                    {
                        ChSolver: 1 + pro_flag.ChSolver
                    },
                    {
                        where: { ChFlag: hash }
                    }
                );

                return true;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

//????????? check
exports.CheckWrongAccess = function CheckWrongAccess(req) {
    const { ID } = req.user;
    if (ReturnUserInfo(req).ID != ID) {
        return true;
    } else {
        return false;
    }
};

exports.datalist = async function datalist() {
    try {
        const problems = await wargame_info.findAll({
            where: {
                deleted: 0
            },
            attributes: ["ChID", "ChCategory", "ChTitle", "ChDescription", "ChDirectory", "ChScore", "ChSolver", "ChLevel", "ChAuthor"]
        });
        if (problems) {
            return problems;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return res.status(200).send('{"Error" : "Wrong"}');
    }
};
/// ?????? ????????? API
exports.SetMulter = function SetMulter() {
    return multer({
        storage: multer.diskStorage({
            destination(req, file, done) {
                done(null, "/mnt/c/SSC-back-master/uploads");
            },
            filename(req, file, done) {
                const ext = path.extname(file.originalname);
                done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 }
    });
};

exports.wargame_upload = async function wargame_upload(req, file) {
    try {
        const { ChCategory, ChTitle, ChDescription, ChScore, ChFlag, ChLevel } = req.body;

        ChAuthor = req.user.ID;
        const Chhash = bcrypt.hashSync(ChFlag, salt);
        if (file) {
            const UploadResult = JSON.parse(JSON.stringify(file));

            await wargame_info.create({
                ChCategory,
                ChTitle,
                ChDirectory: UploadResult.filename,
                ChDescription,
                ChScore,
                ChLevel,
                ChAuthor,
                ChFlag: Chhash,
                ChSalt: salt
                // ChDirectory1: req.files.file1[0].path
            });
            return true;
        } else {
            await wargame_info.create({
                ChCategory,
                ChTitle,
                ChDescription,
                ChScore,
                ChLevel,
                ChAuthor,
                ChFlag: Chhash,
                ChSalt: salt
                // ChDirectory1: req.files.file1[0].path
            });
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};
exports.wargame_update = async function wargame_update(req) {
    try {
        const { ChID, ChCategory, ChTitle, ChDescription, ChScore, ChFlag } = req.body;

        if (req.file) {
            if (ChFlag) {
                const UploadResult = JSON.parse(JSON.stringify(req.file));
                const Chhash = bcrypt.hashSync(ChFlag, salt);
                await wargame_info.update(
                    {
                        ChCategory,
                        ChTitle,
                        ChDescription,
                        ChScore,
                        ChFlag: Chhash,
                        ChSalt: salt,
                        ChDirectory: UploadResult.filename
                    },
                    { where: { ChID } }
                );
                return true;
            } else {
                await wargame_info.update(
                    {
                        ChCategory,
                        ChTitle,
                        ChDescription,
                        ChScore,
                        ChDirectory: UploadResult.filename
                    },
                    { where: { ChID } }
                );
                return true;
            }
        } else {
            if (ChFlag) {
                const Chhash = bcrypt.hashSync(ChFlag, salt);
                await wargame_info.update(
                    {
                        ChCategory,
                        ChTitle,
                        ChDescription,
                        ChScore,
                        ChFlag: Chhash,
                        ChSalt: salt
                    },
                    { where: { ChID } }
                );
                return true;
            } else {
                await wargame_info.update(
                    {
                        ChCategory,
                        ChTitle,
                        ChDescription,
                        ChScore
                    },
                    { where: { ChID } }
                );
                return true;
            }
        }
    } catch (err) {
        return false;
    }
};
exports.CheckNull = function CheckNull(req) {
    const { ChCategory, ChTitle, ChDescription, ChScore, ChLevel } = req.body;
    if (!ChCategory || !ChTitle || !ChDescription || !ChScore || !ChLevel) {
        return true;
    } else {
        return false;
    }
};
exports.pdelete = async function pdelete(idx) {
    const findidx = await wargame_info.findOne({ where: { Chid: idx } });
    if (findidx) {
        return true;
    } else {
        return false;
    }
    // await models.Users.destroy(); // ?????? ?????? ??????
};
exports.CheckNullcomment = function CheckNullcomment(req) {
    const { ChID, ID, ChNick, ChComment, ChParentID } = req.body;
    if (!ChID || !ID || !ChNick || !ChComment || !ChParentID) {
        return true;
    } else {
        return false;
    }
};

exports.addcomment = async function addcomment(req) {
    const { ChID, ID, ChNick, ChComment, ChParentID } = req.body;
    await wargame_info.create({
        ChID,
        ID,
        ChNick,
        ChComment,
        ChParentID,
        ChCommentType: 0,
        ChCommentGroup: 1, //???????????? ??? ?????? ?????? ?????? ????????? +1
        Created_at: Date.now()
    });
};
exports.commentidcheck = async function commentidcheck(req) {
    await lecture_comment.findAll({ where: { ChID: req.body.ChID, ID: req.user } }).then(function (results) {
        if (results) {
            return true;
        } else {
            return false;
        }
    });
};

exports.commentupdate = async function commentupdate(req) {
    const { ChID, ID, ChNick, ChComment, ChParentID } = req.body;
    await wargame_comment.update({
        ChID,
        ID,
        ChNick,
        ChComment,
        ChParentID,
        ChCommentType: 0,
        ChCommentGroup: 1, //???????????? ??? ?????? ?????? ?????? ????????? +1
        Updated_at: Date.now()
    });
};
exports.commentdelete = async function commentdelete(idx) {
    const deleteidx = await lecture_Comment.lecture_Comment.destroy({
        where: { ChId: idx }
    }); // ?????? ??????
    if (deleteidx) {
        return false;
    } else {
        return true;
    }
};

exports.FindUser = async function FindUser(req) {
    const Result = await user_info.findOne({
        where: {
            ID: ChID,
            Nick: Nick
        }
    });

    if (!Result) {
        return true;
    } else {
        return false;
    }
};
exports.CheckSolveListNull = function CheckSolveListNull(params) {
    const { ChID } = params;
    if (!ChID) {
        return true;
    } else {
        return false;
    }
};
exports.GetChallengeSolverList = async function GetChallengeSolverList(params) {
    const data = await solver_table.findAll({
        attributes: ["Nick", "created_at"],
        where: { ChID: params.ChID }
    });
    return data;
};
exports.GetWargameInfo = async function GetWargameInfo(ChID) {
    const data = await wargame_info.findOne({
        attributes: ["ChID", "ChCategory", "ChTitle", "ChDescription", "ChScore", "ChLevel", "ChDirectory"],
        where: { ChID: ChID }
    });
    return data;
};
