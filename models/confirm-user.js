const { Schema, model } = require("mongoose");

const confirmSchema = new Schema({
    leader: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
});

const Confirm = model("confirm",confirmSchema);

module.exports = Confirm;