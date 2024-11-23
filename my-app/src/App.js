import logo from './ubceats_logo.png';
import './App.css';
import React, { useState } from 'react';
import { checkDbConnection} from './scripts';

function App() {
    const [dbStatus, setDbStatus] = useState('');
    const [demotableData, setDemotableData] = useState([]);
    const [usertableData, setUsertableData] = useState([]);
    const [resetMessage, setResetMessage] = useState('');
    const [insertMessage, setInsertMessage] = useState('');
    const [restaurantInfo, setRestaurantInfo] = useState('');
    const [loading, setLoading] = useState(false);


    const checkDbStatus = async () => {
        setLoading(true)
        const textStatus = await checkDbConnection()
        console.log(textStatus)
        setDbStatus(textStatus);
        setLoading(false);
    };

    // Handle reset of demo table
    const resetDemotable = () => {
        // Perform API call to reset the demo table
        setResetMessage('Demo table reset successfully!');
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
              <img src={logo} className="App-logo" alt="logo"/>
          </header>
          <h1>
              Database Connection Status:
              <span id="dbStatus">{dbStatus}</span>
          </h1>
          <img id="loadingGif" className="loading-gif" src="loading_100px.gif" alt="Loading..."/>
          <button onClick={checkDbStatus}>Check DB Status</button>
          <hr/>
          <h2>Show Demotable</h2>
          <table id="demotable" border="1">
              <thead>
              <tr>
                  <th>ID</th>
                  <th>Name</th>
              </tr>
              </thead>
              <tbody>
              {demotableData.map((item, index) => (
                  <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                  </tr>
              ))}
              </tbody>
          </table>

          <hr/>
          <h2>Show Users</h2>
          <table id="usertable" border="2">
              <thead>
              <tr>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
              </tr>
              </thead>
              <tbody>
              {usertableData.map((user, index) => (
                  <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.longitude}</td>
                      <td>{user.latitude}</td>
                  </tr>
              ))}
              </tbody>
          </table>

          <hr/>
          <h2>Reset Demotable</h2>
          <p>If you wish to reset the table, press on the reset button. If this is the first time you're running this
              page, you MUST use reset.</p>
          <button id="resetDemotable" onClick={resetDemotable}>Reset</button>
          <div>{resetMessage}</div>

          <hr/>
          <h2>Insert Values into DemoTable</h2>
          <form id="insertDemotable" onSubmit={insertDemotable}>
              ID: <input type="number" id="insertId" placeholder="Enter ID" required/> <br/><br/>
              Name: <input type="text" id="insertName" placeholder="Enter Name" maxLength="20"/> <br/><br/>
              <button type="submit">Insert</button>
              <br/>
          </form>
          <div>{insertMessage}</div>

          <hr/>
          <h2>Find Restaurant</h2>
          <form id="findRestaurantInfo" onSubmit={findRestaurantInfo}>
              Restaurant Name: <input type="text" id="restaurantName" placeholder="Enter Restaurant Name" required/>
              <br/><br/>
              <button type="submit">Search</button>
              <br/>
          </form>
          <div>{restaurantInfo}</div>

          <hr/>
          <h2>Count the Tuples in DemoTable</h2>
          <button id="countDemotable">Count</button>
          <div id="countResultMsg"></div>
      </div>
  );
}

export default App;
