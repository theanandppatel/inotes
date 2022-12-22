import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import NoteContext from '../context/notes/NoteContext'


const Noteitem = (props) => {
    const context = useContext(NoteContext)
    const { deleteNote } = context;
    const { note, editNt } = props

    const handleDelete = (id) => {
        deleteNote(id)
        props.showAlert("Your Note is successfully deleted","danger")
        
    }
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex" style={{ justifyContent: "space-between" }}>
                        <h5 className="card-title" style={{ maxWidth:"200px" }}>{note.title}</h5>
                        <div className="icon">
                            <i onClick={() => { editNt(note) }}><FontAwesomeIcon className='mx-2' icon={faPenToSquare} /></i>
                            <i onClick={() => { handleDelete(note._id) }} ><FontAwesomeIcon className='mx-2' icon={faTrashCan} /></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>

                </div>
            </div>
        </div>
    )
}

export default Noteitem