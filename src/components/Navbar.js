import {React,useEffect} from 'react';
import {Link,useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    
    let navigate = useNavigate();

    //when user clicks logout authToken is removed from localStorage and navigated/redircted to login
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    }
    
    //useLocation hook gives us the location of the page(i.e the path in the URL or query string) 
    let location = useLocation();
    useEffect(()=>{
        // console.log(location.pathname);
    },[location])
    return <div>
        <nav className={`navbar navbar-expand-lg navbar-dark bg-dark`}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        {/* if location is '/' add 'active' class to the Link (active class shows the text highlighted) */}
                            <Link className={`nav-link ${location.pathname==="/"?"active":""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/about"?"active":""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {/* <div className={`form-check form-switch text-${props.mode === 'light' ? 'dark' : 'light'}`}>
                        <input className="form-check-input" onClick={props.toggleMode} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Enable Dark Mode</label>
                    </div> */}
                    
                    {/* if authToken in localStorage is null then return (login,signup) else return logout */}
                    {!localStorage.getItem('authToken')?<form className="d-flex">
                        <Link to="/login" className="btn btn-outline-light mx-1" role="button">Login</Link>
                        <Link to="/signup" className="btn btn-outline-light mx-1" role="button">Signup</Link>
                    </form> : <button className="btn btn-outline-light" onClick={handleLogout}>Log out</button>}
                </div>
            </div>
        </nav>
    </div>;
}
