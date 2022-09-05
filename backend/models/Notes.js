const mongoose = require("mongoose");
const {Schema} = mongoose;

//create a schema
//add a user so we could link notes to user id and user could view only his notes
const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,   //this acts as foreign key
        ref : 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
});

//create a mongoose model with name 'notes' and schema as 'NotesSchema' and export it
const Notes = mongoose.model('notes',NotesSchema);
module.exports = Notes;