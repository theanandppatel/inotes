import React,{useState,useContext} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';

const Navbar = (props) => {
    let location = useLocation();
    const context = useContext(NoteContext)
    const { searchNote } = context;

    const [search, setSearch] = useState('')

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token')
        console.log(localStorage.getItem('token'));
        navigate("/login")
        props.showAlert("Logged out successfully", "success")
    }

    const handleSearchChange = (e) =>{
        setSearch(e.target.value);
    }

    const handleSearch = () =>{
        searchNote(search);

        
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#">iNotes</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li> */}
                        </ul>

                        {
                            !localStorage.getItem('token') ?
                                <form className="d-flex" role="search">
                                    <Link className="btn btn-primary mx-2" to="/login" role="button">Login</Link>
                                    <Link className="btn btn-primary mx-2" to="/signup" role="button">SignUp</Link>
                                </form>
                                :
                                <div className='d-flex p-2'>
                                    <form className="d-flex mx-3" role="search">
                                        <input onChange={handleSearchChange} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <button className="btn btn-primary btn-md" onClick={handleSearch} type="submit">Search</button>
                                    </form>
                                    <button className="btn btn-primary btn-md" onClick={handleLogout}>Logout</button>
                                </div>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Navbar