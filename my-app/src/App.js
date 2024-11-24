import logo from './ubceats_logo.png';
import './App.css';
import React, { useState } from 'react';
import './index.css';
import { checkDbConnection } from './scripts';

function App() {
    const [dbStatus, setDbStatus] = useState('');
    const [demotableData, setDemotableData] = useState([]);
    const [usertableData, setUsertableData] = useState([]);
    const [resetMessage, setResetMessage] = useState('');
    const [insertMessage, setInsertMessage] = useState('');
    const [restaurantInfo, setRestaurantInfo] = useState('');
    const [loading, setLoading] = useState(false);

    const checkDbStatus = async () => {
        setLoading(true);
        const textStatus = await checkDbConnection();
        console.log(textStatus);
        setDbStatus(textStatus);
        setLoading(false);
    };

    // Handle insert into demo table
    const insertDemotable = (e) => {
        e.preventDefault();
        const id = e.target.insertId.value;
        const name = e.target.insertName.value;
        // Call API to insert into demo table
        setInsertMessage(`Inserted ${name} with ID ${id}`);
    };

    // Handle find restaurant info
    const findRestaurantInfo = (e) => {
        e.preventDefault();
        const restaurantName = e.target.restaurantName.value;
        // Fetch restaurant data using restaurantName
        setRestaurantInfo(`Information for ${restaurantName} found!`); // Use actual fetch logic here
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>
                    Database Connection Status:
                    <span id="dbStatus" className="font-bold text-green-500">
                        {dbStatus}
                    </span>
                </h1>
            </header>

            <img id="loadingGif" className="loading-gif" src="loading_100px.gif" alt="Loading..." />
            <button onClick={checkDbStatus}>Check DB Status</button>

            {/* Add your form or UI to handle restaurant info here */}
            <form onSubmit={findRestaurantInfo}>
                <input type="text" name="restaurantName" placeholder="Enter restaurant name" />
                <button type="submit">Find Restaurant</button>
            </form>

            {restaurantInfo && <p>{restaurantInfo}</p>}
        </div>
    );
}

export default App;
