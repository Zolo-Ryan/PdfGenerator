const User = require("../models/user");

const handleMemberUpload = async (req,res) => {
    const {file, body} = req;
    const {leaderID, username,contact,plan,gender} = body;
    const leader = await User.findById({_id: leaderID});
    if(username === '' || contact === '' || file === undefined)
        return res.render("form-member",{
            leaderID,
            size: leader.membersID.length + 1
    })

    const prevMember = await User.findOne({contact});
    if(prevMember) return res.render("form-member",{
        error: "Team Member already added into the team"
    });

    const member = await User.create({
        leaderID,username,
        college: leader.college,contact,plan,gender,teamName: leader.teamName,
        event: leader.event,
        date: leader.date,
        time: leader.time,
        photo: file.filename,
    });
    await User.findByIdAndUpdate({_id: leaderID},{
        $push:{
            membersID: {
                member: member._id,
                plan: member.plan,
            }
        }
    });
    return res.render("form-member",{
        leaderID,
        size: leader.membersID.length + 2,
    });
};

module.exports = {
    handleMemberUpload,
}