const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true,
        enum: ["STARNIGHT","STAY","NIL"],
        default: "NIL",
    },
    event: {
        type: String,
        required: String,
    },
    role: {
        type: String,
        enum: ["LEADER","MEMBER"],
        default: "MEMBER",
    },
    gender: {
        type: String,
        enum: ["MALE","FEMALE","OTHERS"],
        default: ["MALE"],
    },
    teamName: {
        type: String,
        required: true,
    },
    membersID: [
        {
            member: {
                type: Schema.Types.ObjectId, ref: "user"
            },
            plan: {
                type: String,
            }
    }
    ],
    leaderID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
},{
    timestamps: true,
});

const User = model("user",userSchema);

module.exports = User;