import React,{useContext,useState} from 'react'
import NoteContext from '../context/notes/NoteContext'


const AddNote = (props) => {
    const context = useContext(NoteContext)
    const {addNote} = context;

    const [note, setNote] = useState({title:"",description:"",tag:"Default"})
    
    const handleAdd=(e)=>{
        e.preventDefault();
        if(note.title.length<3){
            alert("Title should be atleast three character")
        }
        else if(note.description.length<3){
            alert("Description should be atleast three character")
        }
        else{
        addNote(note.title,note.description,note.tag);
        document.getElementById('title').value=''
        document.getElementById('description').value=''
        document.getElementById('tag').value=''
        props.showAlert("Note added successfully","success")
        }
    }

    const onChange = (e) =>{
        setNote({...note,[e.target.name]:e.target.value})
    }
    return (
        <div >
            <div className="container my-5">
                <h2>Add a Note</h2>
            </div>
            <div className="conatiner mx-3">
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label" style={{fontWeight:"bold",fontSize:"20px"}}>Title</label>
                        <input type="text" className="form-control" id="title" name='title' onChange={onChange} minLength={3} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label" style={{fontWeight:"bold",fontSize:"20px"}}>Description</label>
                        <input type="text" className="form-control" id="description" name='description' onChange={onChange} minLength={3} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label" style={{fontWeight:"bold",fontSize:"20px"}}>Tag</label>
                        <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleAdd}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote