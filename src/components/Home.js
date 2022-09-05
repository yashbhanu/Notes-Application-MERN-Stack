import React, { useContext } from 'react';
import AddNote from './AddNote';
import Notes from './Notes';

const Home = (props) => {
    const {showAlert} = props
    return (
        <div>
        <AddNote showAlert={showAlert}/>
            <div className="container" style={{ "width": "80%" }}>
                {/* used notes component in home */}
                <Notes showAlert={showAlert}/>   
            </div>
        </div>
    )
}

export default Home;

