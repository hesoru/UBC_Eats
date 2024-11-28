// import React, { useState, useEffect } from 'react';
// import {filterFoods} from "../scripts";

// const FindFood = ({ onFilter }) => {
//     const dietOptions = ['Vegan', 'Vegetarian', 'Kosher', 'Gluten-Free', 'Halal'];
//     const allergenOptions = ['Dairy', 'Gluten', 'Egg', 'Nuts', 'Soy'];

//     // State to hold selected filter options
//     const [selectedDietTypes, setSelectedDietTypes] = useState([]);
//     const [selectedAllergenTypes, setSelectedAllergenTypes] = useState([]);
//     const [filteredMenu, setFilteredMenu] = useState([]);
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     // Handle checkbox change for diet types
//     const handleDietChange = (e) => {
//         const { value, checked } = e.target;
//         setSelectedDietTypes((prev) =>
//             checked ? [...prev, value] : prev.filter((item) => item !== value)
//         );
//     };

//     // Handle checkbox change for allergen types
//     const handleAllergenChange = (e) => {
//         const { value, checked } = e.target;
//         setSelectedAllergenTypes((prev) =>
//             checked ? [...prev, value] : prev.filter((item) => item !== value)
//         );
//     };

//     // Fetch filtered menu items whenever filters change
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const menu = await filterFoods(selectedDietTypes, selectedAllergenTypes);
//         setFilteredMenu(menu);
//         setIsSubmitted(true);  // Indicate that the form has been submitted
//         onFilter(menu);
//     };

//     return (
//         <div>
//             <h1>Find Food</h1>

//             {/* Diet Types Checkboxes */}
//             <div>
//                 <h2>Select Diet Types</h2>
//                 {dietOptions.map((diet) => (
//                     <label key={diet}>
//                         <input
//                             type="checkbox"
//                             value={diet}
//                             onChange={handleDietChange}
//                             checked={selectedDietTypes.includes(diet)}
//                         />
//                         {diet}
//                     </label>
//                 ))}
//             </div>

//             {/* Allergen Types Checkboxes */}
//             <div>
//                 <h2>Select Allergen Types</h2>
//                 {allergenOptions.map((allergen) => (
//                     <label key={allergen}>
//                         <input
//                             type="checkbox"
//                             value={allergen}
//                             onChange={handleAllergenChange}
//                             checked={selectedAllergenTypes.includes(allergen)}
//                         />
//                         {allergen}
//                     </label>
//                 ))}
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit}>Filter</button>
//             </div>

//             {/* Filtered Menu */}
//             <div>
//                 <h2>Filtered Menu</h2>
//                 {isSubmitted ? (
//                     filteredMenu.length > 0 ? (
//                         <ul>
//                             {filteredMenu.map((item, index) => (
//                                 <li key={index}>{item.MENU_ITEM_NAME}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No menu items found for the selected filters.</p>
//                     )
//                 ) : (
//                     <p>Please select filters and click "Filter" to see results.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FindFood;