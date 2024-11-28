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
            <div className="App-header bg-blue-50 text-black py-6 px-8 shadow-md">
                <header className="flex flex-col items-center justify-center text-center space-y-4">
                    <img src={logo} className="App-logo h-16" alt="logo"/>
                    <h1 className="text-3xl font-mono">
                        Looking for delicious food that fits your needs?
                    </h1>

                    <nav className="mt-4 space-x-6">
                        <Link to="/signup" className="text-lg font-bold font-mono hover:text-indigo-200 transition">Sign Up/In</Link>
                        <span className="mx-2 text-gray-400">|</span>
                        <Link to="/restaurants"
                              className="text-lg font-bold font-mono  hover:text-indigo-200 transition">Restaurants</Link>
                        <span className="mx-2 text-gray-400">|</span>
                        <Link to={`/user/${currentUser}`} className="text-lg font-bold font-mono  hover:text-indigo-200 transition">User
                            Review</Link>
                        <span className="mx-2 text-gray-400">|</span>
                        {/* <Link to={`/menu/49.269235/-123.255589`} className="text-lg font-bold font-mono :text-indigo-200 transition">Menu
                            (Temp Link)</Link> |{' '} */}
                        <Link to={`/find-food`} className="text-lg font-bold font-mono hover:text-indigo-200 transition">Find Food</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/signup" element={<SignUp setCurrentUser={setCurrentUser}/>}/>
                    <Route path="/signin" element={<SignIn setCurrentUser={setCurrentUser}/>}/>
                    <Route path="/restaurants" element={<RestaurantsContainer/>}/>
                    <Route path="/user/:userName" element={<UserReview/>}/>
                    <Route path="/menu/:location_name/:lat/:lon" element={<MenuPage/>}/>
                    <Route path="/find-food" element={<FindFood/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
