const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');


//ROUTE:1 Get All Notes using: GET "/api/notes/fetchallnotes". 

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {

        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE:2 Add New Notes using: POST "/api/notes/addnote". 

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 3 characters').isLength({ min: 3 })
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save()
        res.json(saveNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE:3 Update an existing notes using: PUT "/api/notes/updatenote". 

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        if(title.isLength<3){
            res.status(500).send("Internal Server Error");
        }
        if(description.isLength<3){
            res.status(500).send("Internal Server Error");
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE:4 Delete an existing notes using: DELETE "/api/notes/deletenote". 

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allows Only deletion allows only if users owns it!
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note Successfully deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE:5 Get Notes through tag using: GET "/api/notes/fetchnotes". 

router.get('/fetchnotes', fetchuser, async (req, res) => {

    try {
        const ftag = "#"+req.body.tag;
        const searchNote = await Notes.find({ tag: ftag })
        res.json(searchNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router

