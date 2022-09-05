import NoteContext from "./noteContext";  //import our context
import { useState } from "react";


const NoteState = (props) => {

  //declared the host
  const host = "http://localhost:5000";
  //declared an array of object
  const notesInitial = []
  //initialized a state //we initialized the initial state of notes as notesInitial(an array of objects)
  const [notes, setNotes] = useState(notesInitial);

  //API call to fetch notes
  const getNotes = async () => {
    let response = await fetch(`${host}/api/notes/fetchallnotes`,{
      method: 'GET',
      headers : {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('authToken')
      }
    });
    const json = await response.json();
    // we update the state of our notes and pass the notes as an array to Notes.js via ContextApi and iterate through it and render in the DOM
    setNotes(json);
  }


  // Api call to add note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote/`,{
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('authToken')     //fetched the authToken from localStorage and insert into the header   
      },
      body: JSON.stringify({title,description,tag})
    });
    //logic to add note //addNote function wil take title,desc,tag in request body (and user.id will be inserted by our backend through authToken),note.id will be generated automatically by mongo
    const note = await response.json();   //we'll get the added note as response.json
    // setNotes(notes.push(note));  //dont use push bcz it updates the array
    setNotes(notes.concat(note));   //use concat bcz it appends new item to the array
  }

  //API call to delete note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
      method: 'DELETE',
      headers : {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('authToken')       //fetched the authToken from localStorage  
      },
    });
    const json = response.json();
    //logic to delete note in UI
    //api call removes note from DB, but to remove from UI, we pass a filter function to all the existing notes and filter out the note(element passed to func)
    // by returning only those notes where note._id does not match with the id which we have passed in the function(to delete)
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);     //and update the state
  }


  //API call to edit note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
      method: 'PUT',
      headers : {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('authToken')       //fetched the authToken from localStorage  
      },
      body: JSON.stringify({title,description,tag})
    });
    // const json = response.json();

    //logic to edit note in UI
    //parse the current notes nd store in var newNotes
    let newNotes = JSON.parse(JSON.stringify(notes));
    // iterate through all the notes and set element as the cuurentnote for every iteration i.e 1st iteration element = newNotes[0] ,2nd iteration element = newNotes[1],etccc
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      //check if the _id of note[0] iterated matches with id passed  //if it matches then set newNotes[0].title = title(passed in function),etccc 
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    //update the state
    setNotes(newNotes);
  }


  //with the help of '<NoteContext.Provider>' we provided our state (i.e notes) to any component who wants to use
  //and passed {props.children} so any children of NoteState could use the state as props
  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote,editNote,getNotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
