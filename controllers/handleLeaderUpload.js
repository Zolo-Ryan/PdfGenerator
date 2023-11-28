const User = require("../models/user");

const handleLeaderUpload = async (req,res) => {
    const file = req.file;
    const body = req.body;
    const {username,college,contact,event,gender,plan,date,time,teamName} = body;
    if(username === '' || college === '' || contact === '' || date === '' || time === '' || teamName =='')
        return res.redirect("/form");
    const prevUser = await User.findOne({contact})
    if(prevUser) return res.render("form",{
        error: "Team Leader already Submitted the form"
    });
    const user = await User.create({
        username,college,contact,date,plan,time,event,gender,teamName,
        photo: file?.filename,
        role: "LEADER",
        leaderID: null,
    });
    return res.render("form-member",{
        leaderID: user._id,
        size: user.membersID.length + 1,
    });
}

module.exports = {
    handleLeaderUpload,
}