// RestaurantsContainer.js
import React, { useState } from 'react';

const RestaurantsContainer = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);

    const viewAllRestaurants = async () => {
        setLoading(true);
        try {
            const response = await fetch('/fetchAllRestaurants');
            const data = await response.json();
            setAllRestaurants(data);
        } catch (error) {
            console.error("Error fetching all restaurants:", error);
        }
        setLoading(false);
    };

    return (
        <div className="restaurants-container">
        <button onClick={viewAllRestaurants}>View All Restaurants</button>

    {loading && <img className="loading-gif" src="loading_100px.gif" alt="Loading..." />}

    {allRestaurants.length > 0 && (
        <div>
            <h2>All Restaurants:</h2>
    <ul>
    {allRestaurants.map((restaurant, index) => (
            <li key={index}>{restaurant.name}</li>)
    )}
        </ul>
        </div>
    )}
    </div>
);
};

export default RestaurantsContainer;
