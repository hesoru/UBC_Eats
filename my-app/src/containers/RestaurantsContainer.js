
import React, { useState } from 'react';
import {fetchAllRestaurants} from "../scripts";
import RestaurantPage from "./RestaurantPage";
import '../css/RestaurantPage.css';

const RestaurantsContainer = () => {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const viewAllRestaurants = async () => {
        setLoading(true);

        try {
            const response = await fetchAllRestaurants()
            //console.log(response);
            //console.log(result);
            //console.log(Array.isArray(response));
            const finalResult = await setRestaurants(response);
            // console.log(finalResult)
            setAllRestaurants(finalResult);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        }
        setLoading(false);

    };

    const setRestaurants = async (response) => {
        const {metaData, rows} = response.result;

        const columns = metaData.map(col => col.name);
        //console.log(metaData)

        return rows.map(row =>
            columns.reduce((acc, col, index) => {
                acc[col] = row[index];
                return acc;
            }, {})
        );

    }
    return (
        <div className="restaurants-container">
            {selectedRestaurant ? (

                <RestaurantPage restaurant={selectedRestaurant} />
            ) : (
                <>
                    <button onClick={viewAllRestaurants}>View All Restaurants</button>

                    {loading && <p>Loading...</p>}

                    {allRestaurants.length > 0 && (
                        <ul className="restaurant-list">
                            {allRestaurants.map((restaurant, index) => (
                                <li key={index} className="restaurant-item">
                                    <h3>{restaurant.LOCATION_NAME}</h3>
                                    <p>{restaurant.CUISINE_TYPE}</p>
                                    <p>Average Rating: {parseFloat(restaurant.AVERAGE_RATING).toFixed(1)}</p>
                                    <p>Average Price: {restaurant.AVERAGE_PRICE}</p>
                                    <p>Phone Number: {restaurant.PHONE_NUMBER}</p>
                                    <p>Address: {restaurant.STREET_ADDRESS}, {restaurant.CITY}, {restaurant.PROVINCE_OR_STATE}, {restaurant.POSTAL_CODE}</p>
                                    {/*<button onClick={() => setSelectedRestaurant(restaurant)}>*/}
                                    {/*    View Details*/}
                                    {/*</button>*/}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};



export default RestaurantsContainer;
