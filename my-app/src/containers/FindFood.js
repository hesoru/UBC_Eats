
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
        const {value, checked} = e.target;
        setSelectedDietTypes((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleAllergenChange = (e) => {
        const {value, checked} = e.target;
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
        const {metaData, rows} = response.result;
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
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold font-mono text-center mb-6">Select Menu Options</h1>

            {/* Diet Types Checkboxes */}
            <div className="mb-6">
                <h2 className="text-2xl font-medium font-serif mb-2">Select Multiple Dietary Compatible Items (OR) </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dietOptions.map((diet) => (
                        <label key={diet} className="flex items-center font-thin font-mono space-x-2">
                            <input
                                type="checkbox"
                                value={diet}
                                onChange={handleDietChange}
                                checked={selectedDietTypes.includes(diet)}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="text-lg">{diet}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Allergen Types Checkboxes */}
            <div className="mb-6">
                <h2 className="text-2xl font-medium font-serif mb-2">Filter food containing any of the following allergens (AND): </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allergenOptions.map((allergen) => (
                        <label key={allergen} className="flex  font-thin font-mono items-center space-x-2">
                            <input
                                type="checkbox"
                                value={allergen}
                                onChange={handleAllergenChange}
                                checked={selectedAllergenTypes.includes(allergen)}
                                className="form-checkbox h-5 w-5 text-red-600"
                            />
                            <span className="text-lg">{allergen}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="mb-6 text-center">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-indigo-200 text-black font-medium font-mono rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                >
                    Filter
                </button>
            </div>

            {/* Filtered Menu */}
            <div>
                <h2 className="text-gray-500 font-bold font-serif mb-4">Filtered Menu</h2>
                {isSubmitted ? (
                    filteredMenu.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredMenu.map((item, index) => (
                                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    <strong className="text-xl">{item.MENU_NAME}</strong> from
                                    <em className="italic text-indigo-600"> {item.RESTAURANT_NAME}</em> - 
                                    {item.PRICE ? (
                                        <span className="font-semibold text-green-600">
                                        ${item.PRICE.toFixed(2)}
                                    </span>
                                    ) : (
                                        <span className="text-red-500">Price not available</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No menu items found for the selected filters.</p>
                    )
                ) : (
                    <p className="text-gray-500">Please select filters and click "Filter" to see results.</p>
                )}
            </div>
        </div>
    );
};

export default FindFood;
