const mongoose = require("mongoose");
const {Schema} = mongoose;

//create a schema
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//create a mongoose model with name 'user' and schema as 'UserSchema' and export it
const User = mongoose.model('user',UserSchema);
// User.createIndexes();   //createIndexes for unique identification
module.exports = User;