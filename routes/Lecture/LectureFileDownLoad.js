var express = require("express");
var router = express.Router();

var fs = require("fs");
var path = require("path");
var mime = require("mime");

router.get("/:file_name", function (req, res, next) {
    var upload_folder = "C:\\SSC-BACK-REAL\\uploads\\";
    var file = upload_folder + req.params.file_name; // ex) /upload/files/sample.txt
    try {
        if (fs.existsSync(file)) {
            // 파일이 존재하는지 체크
            var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
            var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴

            res.setHeader(
                "Content-disposition",
                "attachment; filename=" + filename
            ); // 다운받아질 파일명 설정
            res.setHeader("Content-type", mimetype); // 파일 형식 지정

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
        } else {
            res.send("해당 파일이 없습니다.");
            return;
        }
    } catch (e) {
        // 에러 발생시
        console.log(e);
        res.send("파일을 다운로드하는 중에 에러가 발생하였습니다.");
        return;
    }
});

module.exports = router;
