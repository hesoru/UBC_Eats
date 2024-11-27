import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './ubceats_logo.png';
import './css/App.css';
import React, { useState } from 'react';
import SignUp from "./components/signup";
import UserReview from "./containers/UserReview";
import MenuPage from "./containers/MenuPage";
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
                        <Link to={`/user/${currentUser}`}>User Review</Link> |{' '}
                        <Link to={`/restaurant/49.267726/-123.253154/menu`}>Menu (Temp Link)</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser} />} />
                    <Route path="/restaurants" element={<RestaurantsContainer />} />
                    <Route path="/user/:userName" element={<UserReview />} />
                    <Route path="/restaurant/:lat/:lon/menu" element={<MenuPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
