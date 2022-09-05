import React, {useContext} from 'react';
import noteContext from '../context/Notes/noteContext'; 

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;           //accept the deleteNote() via contextAPI
    const { note ,updateNote} = props;     //accept the props
    // retuns a card using props to fetch title and description from the element(note)
    return (
    <div className="col-md-3">
        <div className="card my-2">
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                {/* we call the delete function here and pass the note id of that particular note clicked  && we are getting the note id as each and every element(object) represents a card which has its id,t,d,tag*/}
                <i className="fas fa-trash mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted succesfully","success");}}></i>
                <i className="fas fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
            </div>
        </div>
    </div>
    )
};

export default NoteItem;

