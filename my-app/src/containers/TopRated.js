import React, { useState, useEffect } from "react";
import {fetchTopRatedByCuisine} from "../scripts";
import '../css/TopRated.css'

const TopRated = () => {
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const viewTopRated = async () => {
            setLoading(true);

            try {
                const response = await fetchTopRatedByCuisine();
                console.log(response);
                const finalResult = await labelResponse(response);
                setTopRated(finalResult);
            } catch (error) {
                console.error("Failed to fetch top-rated restaurants by cuisine:", error.message);
                setError(error.message);
            }
            setLoading(false);

        };
            viewTopRated()
    }, []);

    const labelResponse = async (response) => {
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

    // Render loading state
    if (loading) {
        return <p>Loading top-rated restaurants by cuisine...</p>;
    }

    // Render error state
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <main className="top-rated-list-container">
            <h1 style={{ marginBottom: '1em'}} className="text-3xl font-extrabold font-mono">Top-Rated Restaurants By Cuisine</h1> 
                {loading && <p>Loading...</p>}
                {topRated.length > 0 ? (
                    <ul className="top-rated-list">
                        {topRated.map((item, index) => (
                            <li key={index} className="top-rated-item">
                                <h3 className="text-lg font-extrabold">{item.CUISINE_TYPE}</h3>
                                <p>Top-Rated Restaurant: {item.RESTAURANT_NAME}</p>
                                <p>Average Rating: {parseFloat(item.AVERAGE_RATING).toFixed(1)}</p>
                            </li>
                        ))}
                    </ul>    
                ) : (
                    <p>No cuisines found.</p>
                )}
        </main>
    );
};

export default TopRated;

