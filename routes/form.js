const router = require("express").Router();
const { handleLeaderUpload } = require("../controllers/handleLeaderUpload");
const { handleMemberUpload } = require("../controllers/handleMemberUpload");
const {upload} = require("../utils/multerUtil");

router.get("/",(req,res) => {
    return res.render("form");
});

router.post("/response",upload.single("photo"),handleLeaderUpload);

router.post("/response/member",upload.single("photo"),handleMemberUpload);

module.exports = router;