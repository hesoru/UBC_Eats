import React, { useState, useEffect } from "react";
import {fetchRestaurantsServingAllDiets} from "../scripts";
import '../css/SuperServers.css'

const SuperServers = () => {
    const [superServers, setSuperServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const viewSuperServers = async () => {
            setLoading(true);

            try {
                const response = await fetchRestaurantsServingAllDiets();
                console.log(response);
                const finalResult = await labelResponse(response);
                setSuperServers(finalResult);
            } catch (error) {
                console.error("Failed to fetch restaurants serving at least one menu item for every diet:", error.message);
                setError(error.message);
            }
            setLoading(false);

        };
            viewSuperServers()
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
        return <p>Loading restaurants serving at least one menu item for every diet...</p>;
    }

    // Render error state
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <main className="super-servers-list-container">
            <h1 className="text-3xl font-extrabold font-mono">Super-Servers</h1> 
                <h2 style={{ marginBottom: '1em'}} className="text-2xl font-extrabold font-mono">
                Restaurants Serving at Least One Menu Item for Every Diet</h2> 
                {loading && <p>Loading...</p>}
                {superServers.length > 0 ? (
                    <ul className="super-servers-list">
                        {superServers.map((item, index) => (
                            <li key={index} className="super-servers-item">
                                <h3 className="text-lg font-extrabold">{item.RESTAURANT_NAME}</h3>
                                <p className={"italic font-thin"}> {item.CUISINE_TYPE}</p>
                            </li>
                        ))}
                    </ul>    
                ) : (
                    <p>No Super-Servers found.</p>
                )}
        </main>
    );
};

export default SuperServers;