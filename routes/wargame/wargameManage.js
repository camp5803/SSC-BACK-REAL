const { ReturnUserInfo } = require("../../middleware/ReturnUserInfo");
const wargame_info = require("../../models/wargame_info");
const user_info = require("../../models/user_info");
const solver_table = require("../../models/solver_table");
const lecture_comment = require("../../models/lecture_Comment");
const rankManage = require("./../rank/rankmanage");
const requestIp = require("request-ip");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);
exports.proinfo = async function proinfo(req) {
    const { ID } = req.user;

    const proinfo = await solver_table.findAll({ where: { ID }, attributes: ["ChID"] });
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
        const { Flag, ChID } = req.body;
        // console.log(flag, ChID);
        if (!Flag || !ChID) {
            return false;
        }
        const pro_salt = await wargame_info.findOne({ where: { ChID }, attributes: ["ChSalt"] });
        const hash = bcrypt.hashSync(Flag, pro_salt.ChSalt);
        const pro_flag = await wargame_info.findOne({ where: { ChFlag: hash }, attributes: ["ChID", "ChFlag", "ChScore","ChCategory"] });
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

            const overlap = await solver_table.findOne({ where: { ChID: pro_flag.ChID } }); //중복풀이 방지

            if (overlap) {
                return false;
            } else {
                const SScore = await user_info.findOne({ where: { ID }, attributes: ["Score"] });

                await user_info.update(
                    // 원래 있던 점수 + 지금 문제 점수
                    { Score: SScore.Score + pro_flag.ChScore, solved_at: Date.now() },
                    {
                        where: { ID: ID },
                        solved_at:Date.now()
                    }
                );
                await solver_table.create({
                    ChID: pro_flag.ChID,
                    ID,
                    created_at: Date.now(),
                    ChCategory: pro_flag.ChCategory
                });
                const redisrank = await rankManage.rank();
                return true;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

//아이디 check
exports.CheckWrongAccess = function CheckWrongAccess(req) {
    const { ID } = req.body;
    if (ReturnUserInfo(req).ID != ID) {
        return true;
    } else {
        return false;
    }
};

exports.datalist = async function datalist() {
    try {
        const problems = await wargame_info.findAll({
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
/// 파일 업로드 API
exports.SetMulter = function SetMulter() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // 파일이 업로드될 경로 설정
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            // timestamp를 이용해 새로운 파일명 설정
            let newFileName = new Date().valueOf() + path.extname(file.originalname);
            cb(null, newFileName);
        }
    });
    var upload = multer({ storage: storage });
};
exports.wargame_upload = async function wargame_upload(req) {
    try {
        const { ChCategory, ChTitle, ChDescription, ChScore, ChFlag, ChLevel } = req.body;

        ChAuthor = req.user.ID;
        const Chhash = bcrypt.hashSync(ChFlag, salt);
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
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};
exports.wargame_update = async function wargame_update(req) {
    const { ChCategory, ChTitle, ChDescription, ChScore, ChFlag } = req.body;
    const Chhash = bcrypt.hashSync(ChFlag, salt);
    await wargame_info.update({
        ChCategory,
        ChTitle,
        ChDescription,
        ChScore,
        ChFlag: Chhash,
        ChSalt: salt,
        ChDirectory1: req.files.file1[0].path
    });
};
exports.CheckNull = function CheckNull(req) {
    const { ChCategory, ChTitle, ChDescription, ChScore, ChFlag, ChLevel } = req.body;
    if (!ChCategory || !ChTitle || !ChDescription || !ChScore || !ChFlag || !ChLevel) {
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
    // await models.Users.destroy(); // 문제 전부 삭제
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
        ChCommentGroup: 1, //대댓글시 그 그룹 번호 다음 댓글시 +1
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
        ChCommentGroup: 1, //대댓글시 그 그룹 번호 다음 댓글시 +1
        Updated_at: Date.now()
    });
};
exports.commentdelete = async function commentdelete(idx) {
    const deleteidx = await lecture_Comment.lecture_Comment.destroy({ where: { ChId: idx } }); // 댓글 삭제
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
