import React, { useContext, useEffect, useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/Notes/noteContext';     //imported our context 
import NoteItem from './NoteItem';

const Notes = (props) => {

  let navigate = useNavigate();

  //'useContext' hook is used here to use our context api(i.e noteContext)
  const context = useContext(noteContext);
  // console.log(context);
  const { notes, getNotes,editNote } = context;       //ES6 destructing //variable context has our state {notes}
  
  //calling the getNotes() on every reload/load/render
  //if authToken is present in localStorage call getNotes() i.e fetch the notes,else navigate to login
  useEffect(() => {
    if(localStorage.getItem('authToken')){
      getNotes()
    }
    else{
        navigate('/login');
    }
  }, []);

  //using useRef hook to give refernce of a button to a particular function
  const ref = useRef(null);
  const refClose = useRef(null);

  
  //when user clicks on edit button a modal is popped, where user can edit
  //we set state of the input tags of that modal 
  const [note, setNote] = useState({eid:"",etitle:"",edescription:"",etag:""});
  
  
  //we declare the update note function which is passed as props to NoteItem and NoteItem's edit button calls the updateNote() func 
  //Each and every noteitem returns a card for a specific object(ie note)  //Whenever updateNote() is called, it is called for that specific note(i.e object {which has id,t,d,tag}) 
  // and that specific note(object) is passed as a argument into updateNote() as 'currentNote'  //hence 'currntNote' represents that specific note(object) 
  const updateNote = (currentNote) => {
    //whenever updateNote() is called ref.click() gets called which pops the modal
    ref.current.click();
    // console.log(currentNote);
    //currentNote is an object of that particular note which is clicked ,passed in NoteItem and we update the state of input tags of our modal as currentNote's t,d,tag
    setNote({eid: currentNote._id,etitle: currentNote.title,edescription: currentNote.description, etag: currentNote.tag});
  }
  
  
  //a function to update the state(i.e value) of the input tags
  const onChange= (e) =>{
      setNote({...note,[e.target.name]: e.target.value});  //keeps the existing note wrapped in 'note' by spread operator and and update the state by setting the value of the target element eg.([e.target.title]:[e.target.python])
  }


  //to make a PUT request to edit && update The UI
  const handleClick= (e) =>{
      //using ref to give refernce of close button to this function
      refClose.current.click();
      //call the function and add the values
      editNote(note.eid,note.etitle,note.edescription,note.etag);
      props.showAlert("Updated succesfully","success");
  }
  

  return (
    <>
    <div>
    {/* modal */}
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Edit Title</label>
                  {/* we gave the 'name' to our input tag (of modal) and a function onChange to update the state as we type, and gave the value as the state object*/}
                  <input type="text" className="form-control"  minLength={5} required  id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Edit Description</label>
                  <input type="text" className="form-control"  minLength={5} required  id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Edit Tags</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled={note.etitle.length<3 || note.edescription.length<5} onClick={handleClick} className="btn btn-dark">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      {/* /modal closed */}
      
      <div className="row my-3">
        <h2>Your Notes</h2>
          {notes.length === 0 && 'No Notes to display'}
        {/* our state (i.e notes) is an array of objects && we iterate through the elements of array using map() and for every element(i.e note) we return the component NoteItem (i.e a card)*/}
        {/* we pass the note as props  && updateNote() as props*/}
        {notes.map((note) => {
          return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
        })}
      </div>
    </div>
    </>
  )
}

export default Notes;