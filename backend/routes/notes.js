const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
let fetchuser = require('../middleware/fetchuser'); //fetch middleware function
const Notes = require('../models/Notes');           //import mongoose model

//Route 1: Get all the notes using : GET"api/notes/fetchallnotes". login required
//pass the fetchuser middleware function and get the current userid and userData 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        //find notes where req.user.id (i.e current user)   //.find() is a mongoose model method
        const notes = await Notes.find({ user: req.user.id })   //'req.user.id' has particular userId fetched from Middleware function
        res.json(notes);

    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Interval server occured");
    }
});


//Route 2: add a new note using : POST"api/notes/addnote". login required
//pass the fetchuser middleware function and get the current user 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 letters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;       //ES6 destructing
        //express-validator code which validates the requests, catches the error and sends error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //create a new note which has req.user.id (i.e fetching user id via fetchuser func(via token)) for that particular user
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();        //savenote 

        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server occured");
    }

});


//Route 3: update note using : PUT"api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        //find the note to be updated and update
        let note = await Notes.findById(req.params.id);     //(req.params.id gets id of the note to be updated (updatenote/:id i.e'782782') the id part is 'param.id') and findById() method fetches the entire object of that particular note with title,userid,descrip,tag
        if (!note) { return res.status(404).send("Not Found") }

        // note.user.toString() fetches the userid from 'note' object and compares it with request.user.id to check whether its logged in user or not // this is for authorization => the note can be deleted only by the owner of that note and no one else
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        // console.log(note.user.toString())

        //update the existing note object// by findByIdAndUpdate() mongoose method //req.params.id takes the id of that particular note to be updated, {$set: sets the 'newNote'} and new would be true
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Interval server occured");
    }
});


//Route 4: delete EXISTING note using : DELETE"api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);     //(req.params.id gets id of the note to be updated) and fetches the entire object of that particular note with title,userid,descrip,tag
        if (!note) { return res.status(404).send("Not Found") }

        //allow deletion only if user is the owner of this note (i.e authorization)
        // note.user.toString() fetches the userid from 'note' object and compares it with request.user.id to check whether its logged in user is or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        // console.log(note.user.toString())

        //delete the existing note object// by findByIdAndDelete() method //req.params.id takes the id of that particular note to be deleted
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": `Note with id ${req.params.id} has been deleted successfully`, note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server occured");
    }
});



module.exports = router;