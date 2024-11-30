/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

const host = 'http://localhost:50001'

// This function checks the database connection and updates its status on the frontend.
export async function checkDbConnection() {
    const response = await fetch(`${host}/check-db-connection`, {
        method: "GET"
    });
    return await response.text();
}

export async function fetchAllRestaurants() {
    try {
        const response = await fetch(`${host}/fetch-all-restaurants`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching all restaurants:", error);
        return [];
    }
}

export async function fetchTopRatedByCuisine() {
    try {
        const response = await fetch(`${host}/top-rated-by-cuisine`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching top-rated restaurants by cuisine:", error);
        return [];
    }
}

export async function fetchRestaurantsServingAllDiets() {
    try {
        const response = await fetch(`${host}/serving-all-diets`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching restaurants serving at least one menu item for every diet:", error);
        return [];
    }
}

export async function fetchUsersReviews(userName) {
    const response = await fetch(`${host}/fetch-user-reviews/${encodeURIComponent(userName)}`, {
        method: 'GET'
    });


    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    return await response.json();
}

export async function fetchReviewContent(reviewID) {
        const response = await fetch(`${host}/fetch-user-review/${encodeURIComponent(reviewID)}`, {
            method: 'GET'
        });

           if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
           }
       return await response.json();
}


export async function updateUserReview(newContent, columnName, reviewID) {

/// Have FRONT END ENSURE IF RATING IS BEING CHANGED THAT ONLY THE NUMBER VALUE IS BETWEEN 0 -5
/// AND CONTENT CHAR LENGTH < 200 char

    try {
        const response = await fetch(
            `${host}/update-user-review`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newContent,
                    columnName,
                    reviewID,
                }),
            }
        );
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating user review:', error);
        throw error;
    }
}


export async function deleteReview(reviewID) {

/// Have FRONT END ENSURE IF RATING IS BEING CHANGED THAT ONLY THE NUMBER VALUE IS BETWEEN 0 -5
/// AND CONTENT CHAR LENGTH < 200 char

    try {
        const response = await fetch(
            `${host}/delete-review/${encodeURIComponent(reviewID)}`,
            {
                method: 'DELETE',
            }
        );
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating user review:', error);
        throw error;
    }
}

export async function getRestaurantMenu(location_name, lat, lon) {
    try {
        const response = await fetch(`${host}/menu/${location_name}/${lat}/${lon}`, {
            method: "GET"
        });
        console.log("response: " + response);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching restaurant menu:", error.message);
        return [];
    }
}

export async function filterFoods(dietTypes, allergenTypes) {
    try {
        //console.log(dietTypes, allergenTypes.type)
        const response = await fetch(`${host}/filter-food`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dietTypes,
                allergenTypes,
            })
        });
        //console.log("response: " + response);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching food items:", error.message);
        return [];
    }
}

export async function filterFoodFromDescription(description) {
    try {
        //console.log(dietTypes, allergenTypes.type)
        const response = await fetch(`${host}/fetch-food-having/${description}`, {
            method: "GET",
        });
        //console.log("response: " + response);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching food items:", error.message);
        return [];
    }
}


export async function isValidUserName(userName) {
    try {
        console.log("response: " + userName);
        const response = await fetch(`${host}/check-username/${userName}`, {
            method: "GET",
        });
        console.log("response: " + userName);

        if (!response.ok) {
            response.result = null;
            return response.json();
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching username:", error.message);
        return [];
    }
}

export async function isProfileUnique(username, email) {
    try {
        console.log("params: " + username + ", " + email);
        const response = await fetch(`${host}/check-unique/${username}/${email}`, {
            method: "GET",
        });

        console.log("response: " + response);
        // if (!response.ok) {
        //     response.result = false;
        //     return response.json();
        // }

        return await response.json();

    } catch (error) {
        console.log("Error fetching username:", error.message);
        return [];
    }
}

// / List restaurant locations based on given restaurant
// export async function findRestaurantInfo(restaurantNameValue) {
//     const url =`${host}/find-restaurants?restaurantName=${encodeURIComponent(restaurantNameValue)}`;
//
//     const response = await fetch(url, {
//         method: 'GET'
//     });
//     const responseData = await response.json();
//     console.log(responseData)
//     const messageElement = document.getElementById('restaurantInfoMsg');
//
//     if (responseData.success) {
//         messageElement.textContent = "Found Restaurant successfully!";
//         //fetchTableData();
//     } else {
//         messageElement.textContent = "Restaurant not found";
//     }
// }
