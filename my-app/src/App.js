import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './ubceats_logo.png';
import './css/App.css';
import React, { useState } from 'react';
import SignUp from "./components/signup";
import UserReview from "./containers/UserReview";
import RestaurantsContainer from "./containers/RestaurantsContainer";

function App() {
    const [currentUser, setCurrentUser] = useState('');

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>
                        Looking for delicious food that fits your needs?
                    </h1>
                    <nav>
                        <Link to="/signup">Sign Up/In</Link> |{' '}
                        <Link to="/restaurants">Restaurants</Link> |{' '}
                        <Link to={`/user/${currentUser}`}>User Review</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser} />} />
                    <Route path="/restaurants" element={<RestaurantsContainer />} />
                    <Route path="/user/:userName" element={<UserReview />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
