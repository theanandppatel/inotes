import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext'
import AddNote from './AddNote';
import Noteitem from './Noteitem';

const Notes = (props) => {

    const navigate = useNavigate();
    const { showAlert } = props
    const context = useContext(NoteContext)
    const { notes, getNote, editNote } = context;

    useEffect(() => {

        if (localStorage.getItem('token') != null) {
            getNote();
        }
        else {
            props.showAlert("Please Login to Add Your Notes on the iNotes", "warning")
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [])

    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "Default" })
    const ref = useRef(null)
    const refClose = useRef(null)

    const editNt = (currentNote) => {

        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
        ref.current.click()
    }

    const handleEdit = (e) => {
        e.preventDefault();
        if (note.etitle.length < 3) {
            alert("Title should be atleast three character")
        }
        else if (note.edescription.length < 3) {
            alert("Description should be atleast three character")
        }
        else {
            editNote(note.id, note.etitle, note.edescription, note.etag);
            refClose.current.click()
            props.showAlert("Your Note is successfully edited", "primary")
        }

    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <AddNote showAlert={showAlert} />
            <button ref={ref} hidden="hidden" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit a Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name='etitle' onChange={onChange} value={note.etitle} minLength={3} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name='edescription' onChange={onChange} value={note.edescription} minLength={3} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' onChange={onChange} value={note.etag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleEdit}>Update a Note</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row my-5">
                <h2>Your Notes</h2>
                {notes.length === 0 ?
                    <p className='mx-2'>No notes to preview</p>
                    :
                    notes.map((note) => {
                        return <Noteitem key={note._id} note={note} showAlert={showAlert} editNt={editNt} />
                    })
                }
            </div>
            
        </>
    )
}

export default Notes