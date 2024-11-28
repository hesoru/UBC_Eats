
import React, { useState } from 'react';
import { filterFoods } from "../scripts";

const FindFood = () => {
    const dietOptions = ['Vegan', 'Vegetarian', 'Kosher', 'Halal'];
    const allergenOptions = ['Dairy', 'Gluten', 'Egg', 'Nuts', 'Soy', "Shellfish", "Alcohol", "Chickpeas"];

    const [selectedDietTypes, setSelectedDietTypes] = useState([]);
    const [selectedAllergenTypes, setSelectedAllergenTypes] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleDietChange = (e) => {
        const { value, checked } = e.target;
        setSelectedDietTypes((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleAllergenChange = (e) => {
        const { value, checked } = e.target;
        setSelectedAllergenTypes((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await filterFoods(selectedDietTypes, selectedAllergenTypes);
        const menu = await setFilteredFoods(response);
        setFilteredMenu(menu);
        setIsSubmitted(true);
    };

    const setFilteredFoods = async (response) => {
        const { metaData, rows } = response.result;
        console.log("Response:", response);

        const columns = metaData.map(col => col.name);

        return rows.map(row =>
            columns.reduce((acc, col, index) => {
                acc[col] = row[index];
                return acc;
            }, {})
        );
    };

    return (
        <div>
            <h1>Find Food</h1>

            {/* Diet Types Checkboxes */}
            <div>
                <h2>Select Diet Types</h2>
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

            {/* Allergen Types Checkboxes */}
            <div>
                <h2>Select Allergen Types</h2>
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

            {/* Submit Button */}
            <div>
                <button onClick={handleSubmit}>Filter</button>
            </div>

            {/* Filtered Menu */}
            <div>
                <h2>Filtered Menu</h2>
                {isSubmitted ? (
                    filteredMenu.length > 0 ? (
                        <ul>
                            {filteredMenu.map((item, index) => (
                                <li key={index}>
                                    {/* Updated property names */}
                                    <strong>{item.MENU_NAME}</strong> from <em>{item.RESTAURANT_NAME}</em> -
                                    {item.PRICE ? `$${item.PRICE.toFixed(2)}` : "Price not available"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No menu items found for the selected filters.</p>
                    )
                ) : (
                    <p>Please select filters and click "Filter" to see results.</p>
                )}
            </div>
        </div>
    );
};

export default FindFood;
