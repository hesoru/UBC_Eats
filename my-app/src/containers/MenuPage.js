import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {getRestaurantMenu} from "../scripts";
import '../css/MenuPage.css'

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { lat, lon } = useParams();

    // Fetch the menu when the component mounts or the params change
    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getRestaurantMenu(lat, lon);
                console.log(data.result);
                setMenuItems(data.result || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (lat && lon) {
            fetchMenu();
        }
    }, [lat, lon]);

    // Render loading state
    if (loading) {
        return <p>Loading menu...</p>;
    }

    // Render error state
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    // TODO: change lat/lon to restaurant name item.Price.toFixed(2)
    return (
        <main className="menu-list-container">
            <h1 className="text-2xl font-extrabold">Menu for Location at ({lat}, {lon})</h1> 
                {menuItems.length > 0 ? (
                    <ul className="menu-list">
                        {menuItems.map((item, index) => (
                            <li key={index} className="menu-item">
                                <h3 style={{ marginBottom: '1em'}} className="text-lg font-extrabold">{item[0]}</h3>
                                <p>{item[1]}</p>
                                <p style={{fontWeight: 'bold', marginBottom: '12px'}}>Price: ${item[2].toFixed(2)}</p>
                                {item[3] && <p>Dietary Info: {item[3] || "Not specified"}</p>}
                                {item[4] && <p>Allergens: Contains {item[4] || "Not specified"}</p>}
                            </li>
                        ))}
                    </ul>    
                ) : (
                    <p>No menu items available for this location.</p>
                )}
            <Link to="/restaurants" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
                Back to Restaurants
            </Link>
        </main>
    );
};

export default MenuPage;

// import React, { useState, useEffect } from 'react';

// const RestaurantMenu = ({ restaurantId }) => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const host = 'http://localhost:50001'

//   // Fetch the menu when the component mounts or the restaurantId changes
//   useEffect(() => {
//     const fetchMenu = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`${host}/${restaurantId}/menu`);
//         if (!response.ok) {
//           throw new Error(`Error fetching menu: ${response.status} - ${response.statusText}`);
//         }
//         const data = await response.json();
//         setMenuItems(data.result || []);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (restaurantId) {
//       fetchMenu();
//     }
//   }, [restaurantId]);

//   // Render loading state
//   if (loading) {
//     return <p>Loading menu...</p>;
//   }

//   // Render error state
//   if (error) {
//     return <p style={{ color: 'red' }}>Error: {error}</p>;
//   }

//   // Render menu items
//   return (
//     <div>
//       <h1>{restaurantId}: Restaurant Menu</h1>
//       {menuItems.length === 0 ? (
//         <p>No menu items available for this restaurant.</p>
//       ) : (
//         <ul>
//           {menuItems.map((item) => (
//             <li key={item.id}>
//               <h3>{item.name}</h3>
//               <p>{item.description}</p>
//               <p>Price: ${item.price}</p>
//               {item.allergens && <p>Allergens: {item.allergens}</p>}
//               {item.dietary_restrictions && <p>Dietary Info: {item.dietary_restrictions}</p>}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default RestaurantMenu;