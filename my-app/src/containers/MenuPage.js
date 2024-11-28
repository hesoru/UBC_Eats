import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {getRestaurantMenu} from "../scripts";
import '../css/MenuPage.css'
// import FindFood from './FindFood';

const MenuPage = () => {
    // const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { location_name, lat, lon } = useParams();
    const [consolidatedItems, setConsolidatedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    // State to hold selected filter options
    const dietOptions = ['Vegan', 'Vegetarian', 'Kosher', 'Gluten-Free', 'Halal'];
    const allergenOptions = ['Dairy', 'Gluten', 'Egg', 'Nuts', 'Soy'];
    const [selectedDietTypes, setSelectedDietTypes] = useState([]);
    const [selectedAllergenTypes, setSelectedAllergenTypes] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Consolidate menu items with the same name, description, and price
    const consolidateMenuItems = (items) => {
        // Convert each item to an object
        const itemsAsObjects = items.map(item => {
            return {
                name: item[0],
                description: item[1],
                price: item[2],
                diet: item[3],
                allergens: item[4]
            };
        });

        const consolidated = itemsAsObjects.reduce((menu, item) => {
            const { name, description, price, diet, allergens } = item;

            // Find if there's already a group with the same name, description, and price
            const existingItem = menu.find(
                (entry) => entry.name === name && entry.description === description && entry.price === price
            );

            if (existingItem) {
                if (diet && !existingItem.diet.includes(diet)) {
                    existingItem.diet.push(diet);
                }
                if (allergens && !existingItem.allergens.includes(allergens)) {
                    existingItem.allergens.push(allergens);
                }
            } else {
                // Create a new entry
                menu.push({
                    name,
                    description,
                    price,
                    diet: diet ? [diet] : [],
                    allergens: allergens ? [allergens] : []
                });
            }
            return menu;
        }, []);
        return consolidated;
    };


    // Fetch the menu when the component mounts or the params change
    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log(location_name);
                const menuItems = await getRestaurantMenu(location_name, lat, lon);
                const consolidatedItems = await consolidateMenuItems(menuItems.result);
                setConsolidatedItems(consolidatedItems);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (location_name && lat && lon) {
            fetchMenu();
        }
    }, [location_name, lat, lon]);

    // const handleFilteredMenu = (filteredMenu) => {
    //     setFilteredItems(filteredMenu);
    // };

    // Handle checkbox change for diet types
    const handleDietChange = (e) => {
        const { value, checked } = e.target;
        setSelectedDietTypes((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };
 
    // Handle checkbox change for allergen types
    const handleAllergenChange = (e) => {
        const { value, checked } = e.target;
        setSelectedAllergenTypes((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    // Filter foods based on selected filters (Diet & Allergen)
    const filterFoods = async () => {
        // const menu = await getRestaurantMenu(location_name, lat, lon);
        // let filteredMenu = menu.result;
        let filteredMenu = consolidatedItems;

        // Filter by selected diet types
        if (selectedDietTypes.length > 0) {
            filteredMenu = filteredMenu.filter(item =>
                selectedDietTypes.every(diet => item.diet && item.diet.includes(diet))
            );
        }

        // Filter by selected allergens
        if (selectedAllergenTypes.length > 0) {
            filteredMenu = filteredMenu.filter(item =>
                selectedAllergenTypes.every(allergen => item.allergens && !item.allergens.includes(allergen))
            );
        }

        // const consolidated = consolidateMenuItems(filteredMenu);
        setFilteredItems(filteredMenu);
    };

    const menuToDisplay = filteredItems.length > 0 ? filteredItems : consolidatedItems;

    // // Fetch filtered menu items whenever filters change
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const menu = await filterFoods(selectedDietTypes, selectedAllergenTypes);
    //     setFilteredMenu(menu);
    //     setIsSubmitted(true);  // Indicate that the form has been submitted
    //     // onFilter(menu);
    // };

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
            <h1 className="text-2xl font-extrabold">Menu for {location_name}</h1> 

                {/* FindFood Component - Filters for diet and allergens */}
                <div>
                    <h2>Select Dietary Restrictions</h2>
                    {dietOptions.map((diet) => (
                        <label key={diet}>
                            <input
                                type="checkbox"
                                value={diet}
                                onChange={handleDietChange}
                                checked={selectedDietTypes.includes(diet)}
                            />
                            {diet}
                        </label>
                    ))}
                </div>

                <div>
                    <h2>Select Allergens</h2>
                    {allergenOptions.map((allergen) => (
                        <label key={allergen}>
                            <input
                                type="checkbox"
                                value={allergen}
                                onChange={handleAllergenChange}
                                checked={selectedAllergenTypes.includes(allergen)}
                            />
                            {allergen}
                        </label>
                    ))}
                </div>

                <div>
                    <button onClick={filterFoods}>Filter</button>
                </div>

                {menuToDisplay.length > 0 ? (
                    <ul className="menu-list">
                        {menuToDisplay.map((item, index) => (
                            <li key={index} className="menu-item">
                                <h3 style={{ marginBottom: '1em'}} className="text-lg font-extrabold">{item.name}</h3>
                                <p>{item.description}</p>
                                <p style={{fontWeight: 'bold', marginBottom: '12px'}}>
                                    {item.price != null ? `Price: $${item.price.toFixed(2)}` : "Price: N/A"}
                                </p>
                                {/* {item[2] && <p>Price: {"$" + item[2] || "Not specified"}</p>} */}
                                {item.diet && item.diet.length > 0 && (
                                    <div>
                                        <p><strong>Dietary Info:</strong> {item.diet.join(', ')}</p>
                                    </div>
                                )}
                                {item.allergens && item.allergens.length > 0 && (
                                    <div>
                                        <p><strong>Allergens:</strong> {item.allergens.join(', ')}</p>
                                    </div>
                                )}
                                {/* {item.diet && <p>Dietary Info: {item.diet || "Not specified"}</p>}
                                {item.allergens && <p>Allergens: Contains {item.allergens || "Not specified"}</p>} */}
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