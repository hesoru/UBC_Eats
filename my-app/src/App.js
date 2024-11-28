import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './ubceats_logo.png';
import './css/App.css';
import React, { useState } from 'react';
import SignUp from "./components/signup";
import UserReview from "./containers/UserReview";
import MenuPage from "./containers/MenuPage";
import RestaurantsContainer from "./containers/RestaurantsContainer";
import SignIn from "./components/SignIn";
import FindFood from "./containers/FindFood";

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
                        <Link to={`/menu/49.269235/-123.255589`}>Menu (Temp Link)</Link>
                        <Link to={`/find-food`}>FindFood</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser} />} />
                    <Route path="/signin" element={<SignIn setCurrentUser={setCurrentUser} />} />
                    <Route path="/restaurants" element={<RestaurantsContainer />} />
                    <Route path="/user/:userName" element={<UserReview />} />
                    <Route path="/menu/:lat/:lon" element={<MenuPage />} />
                    <Route path="/find-food" element={<FindFood />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
