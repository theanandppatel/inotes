import { React, useState } from "react";
import NoteContext from "./NoteContext";

/* eslint-disable no-unused-vars */

const NoteState = (props) => {
  const host = props.bknd_host;

  const initNotes = []

  const [notes, setNotes] = useState(initNotes)

  //Search Notes
  const searchNote = async(tag) =>{
    //API CALL
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({tag}) // body data type must match "Content-Type" header
    });
     const json = await response.json(); // parses JSON response into native JavaScript objects

     console.log("json");
    //Display Notes
    setNotes(json)
  }
  //Get All Notes
  const getNote = async () => {

    //API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify() // body data type must match "Content-Type" header
    });
     const json = await response.json(); // parses JSON response into native JavaScript objects


    //Display Notes

    setNotes(json)
  }

  
  //Add a Note
  const addNote = async (title, description, tag) => {

    //API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects

    //Logic to add a Not
    const note = json;
    setNotes(notes.concat(note))
  }

  //Edit a Note
  const editNote = async (id, title, description, tag) => {

    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
    });
    const json = response.json(); // parses JSON response into native JavaScript objects

    //Logic to edit a note

    const newNote = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id===id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote)
    
  }

  //Delete a Note
  const deleteNote = async (id) => {

    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },// body data type must match "Content-Type" header
    });
    // const json = response.json(); // parses JSON response into native JavaScript objects


    //Logic to delete a note
    const newNotes = notes.filter((note) => note._id !== id)
    setNotes(newNotes)
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote,getNote,searchNote }}>
      {props.children}
    </NoteContext.Provider>
  )
}

/* eslint-enable no-unused-vars */

export default NoteState;