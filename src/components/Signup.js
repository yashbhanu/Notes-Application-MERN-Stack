import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    //set the state of input text of form
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    
    //for confirming password
    const [confirmPWD, setConfirmPWD] = useState("");

    // usenavigate to redirect the pages
    let navigate = useNavigate();

    // console.log(credentials.password)
    // console.log(credentials.cpassword)
    //POST request to sign up which takes the updated(state) values of our state/credentails
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.cpassword) {
            setConfirmPWD("Password does not match");
        }
        else {
            const { name, email, password } = credentials;
            // console.log(credentials);
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const json = await response.json();
            // console.log(json);
        

        //set a variable success=true OR false in backend  //after making the post request a Auth-Token will be generated and the token would be sent as response
        //if error occurs in backend var success would be false and error would be shown // if request is successful, AuthToken and var success =True would be sent in response
        //if success is True in the response save the AuthToken to localstorage and redirect to Home 
        if (json.success) {
            //save authtoken and redirect
            localStorage.setItem('authToken', json.authToken);
            navigate("/");
            props.showAlert("Account created successfully", "success");
        }
        else {
            props.showAlert("Invalid credentials", "danger");
        }
    }
    }

    //to update the state of text as user types
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="container mt-3" style={{ "width": "70%" }}>
            <h2>Sign Up here</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" minLength={3} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" required />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} name="password" id="password" minLength={8} required />
                    <div id="emailHelp" className="form-text">Password must be atleast 8 characters</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="cpassword" name="cpassword" minLength={8} required />
                    <div id="confirmPWD" name="confirmPWD" className="form-text" style={{color: 'red'}} >{confirmPWD}</div>
                </div>
                <button disabled={credentials.password.length < 8 || credentials.cpassword.length < 8} type="submit" className="btn btn-dark">Submit</button>
            </form>
        </div>
    )
}

export default Signup;
