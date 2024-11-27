const oracledb = require('oracledb');
require('dotenv').config();


// Database configuration setup. Ensure your .env file has the required database credentials.
// const dbConfig = {
//     user: envVariables.ORACLE_USER,
//     password: envVariables.ORACLE_PASS,
//     connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
//     poolMin: 1,
//     poolMax: 3,
//     poolIncrement: 1,
//     poolTimeout: 60
// };
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};


// initialize connection pool
// async function initializeConnectionPool() {
//     try {
//         await oracledb.createPool(dbConfig);
//         console.log('Connection pool started');
//     } catch (err) {
//         console.error('Initialization error: ' + err.message);
//     }
// }
async function initializeConnectionPool() {
    try {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_DIR })
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

//// ore's
async function addUserProfile(username, first_name, last_name, email, location) {
    return await withOracleDB(async (connection) => {

        const longitude = location.lng;
        const latitude = location.lat;
        const result = await connection.execute(
            `INSERT INTO User_Has (Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude)
             VALUES (:username, :first_name, :last_name, :email, :longitude, :latitude)`,
            [username, first_name, last_name, email, longitude, latitude],
            { autoCommit: true }
        );
        console.log(result);
        console.log("This is my result");

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function addUserLocation(location) {
    return await withOracleDB(async (connection) => {
        const longitude = location.lng;
        const latitude = location.lat;
        const result = await connection.execute(
            `INSERT INTO User_Location (LONGITUDE, LATITUDE)
             SELECT :longitude, :latitude
             FROM dual
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM User_Location ul
                 WHERE ul.LONGITUDE = :longitude
                   AND ul.LATITUDE = :latitude
             )`,
            [longitude, latitude],
            { autoCommit: true }
        );
        console.log(result);
        console.log("This is my result");

        return true;
    })
}

async function fetchAllReviewsFromUser(userName) {
    return await withOracleDB(async (connection) => {

        console.log("before connecting")
        const result = await connection.execute('SELECT ID FROM REVIEW_FOR_MAKES WHERE USERNAME=:userName', [userName]);
        console.log("after connecting")
        return result.rows;

    }).catch(() => {
        return [];
    });
}
async function fetchAllRestaurantsFromDb() {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute(
            "SELECT rl.Location_Name,\n" +
            "       rl.STREET_ADDRESS,\n" +
            "       rl.CITY,\n" +
            "       rl.PROVINCE_OR_STATE,\n" +
            "       rl.POSTAL_CODE,\n" +
            "       rl.PHONE_NUMBER,\n" +
            "       r.Cuisine_Type,\n" +
            "       r.Average_Price,  -- Added Average_Price\n" +
            "       rl.AVERAGE_RATING,\n" +
            "       COUNT(*) AS Total_Rows\n" +
            "FROM Restaurant_Location_Has rl\n" +
            "JOIN Restaurant r ON rl.Restaurant_Id = r.Id\n" +
            "GROUP BY rl.Location_Name,\n" +
            "         rl.STREET_ADDRESS,\n" +
            "         rl.CITY,\n" +
            "         rl.PROVINCE_OR_STATE,\n" +
            "         rl.POSTAL_CODE,\n" +
            "         rl.PHONE_NUMBER,\n" +
            "         r.Cuisine_Type,\n" +
            "         r.Average_Price,\n" +
            "         rl.AVERAGE_RATING\n",
            []  // Empty array????
        );
        console.log("after connecting")
        return result;

    }).catch(() => {
        return [];
    });
}

async function fetchAUserReview(reviewID) {
    return await withOracleDB(async (connection) => {
        console.log(reviewID)
        const query = `
            SELECT
                rl.Location_Name,
                rfm.Content AS Review_Content,
                rfm.Rating,
                rfm.Record_Date,
                rfm.Record_Time
            FROM
                Review_For_Makes rfm
            JOIN
                Restaurant_Location_Has rl
            ON
                rfm.Restaurant_Longitude = rl.Longitude
                AND rfm.Restaurant_Latitude = rl.Latitude
            WHERE
                rfm.Id = :reviewID
        `;

        const result = await connection.execute(query, [reviewID]);

        return result.rows;
    }).catch(() => {
        //console.error("Error fetching review for reviewID:", reviewID, err);
        return [];
    });
}



async function updateReviewContent(newContent, columnName, reviewID) {
    // BE SURE TO ONLY BE ABLE TO UPDATE THE FOLOWING COLUMNS: Content (VARCHAR2),
    // Rating (0 - 5)
    return await withOracleDB(async (connection) => {
        console.log("before update connecting")

        const validColumns = ['CONTENT', 'RATING'];
        // console.log("Passed Content variable: ", columnName)
        if (!validColumns.includes(columnName)) {
            throw new Error('Invalid column name');
        }
        const result = await connection.execute(
            `UPDATE Review_For_Makes 
            SET 
            ${columnName} = :newContent,
            Record_Date = SYSDATE,              
            Record_Time = SYSTIMESTAMP 
            where 
            Id=:reviewID `,
            [newContent, reviewID],
            { autoCommit: true }
        );

        console.log("after update connecting")

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteReviewContent(reviewID) {
    // TODO: when writing api endpoint of deleting user name, also delete all review associated if on Delete cascade is enabled
    return await withOracleDB(async (connection) => {
        console.log("before delete connecting");

        const result = await connection.execute(
            `DELETE FROM Review_For_Makes
            WHERE ID =:reviewID`,
            [reviewID],
            { autoCommit: true }
        );

        console.log("after delete connecting");

        // Check if any rows were affected
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error deleting review content:', err);
        return false;
    });
}

async function findRestaurant(restaurantName) {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute(
            `SELECT Location_Name, Street_Address, Postal_Code, Phone_Number, Average_Rating 
            FROM Restaurant_Location_Has WHERE UPPER(Location_Name)=UPPER(:restaurantName)`,
            [restaurantName]);
        console.log("after connecting", result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRestaurantMenuFromDb(lat, lon) {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute(`
            SELECT
                mi.Menu_Item_Name,
                mi.Description,
                mi.Price,
                d.Diet_Type,
                a.Allergen_Type
            FROM 
                Menu_Item_On mi
            JOIN 
                Menu_Serves ms ON mi.Menu_Id = ms.Id
            JOIN 
                Restaurant_Location_Has rlh ON ms.Restaurant_Latitude = rlh.Latitude AND ms.Restaurant_Longitude = rlh.Longitude
            LEFT JOIN 
                Contains_Diet cd ON mi.Menu_Item_Name = cd.Menu_Item_Name AND mi.Menu_Id = cd.Menu_Id
            LEFT JOIN 
                Diet d ON cd.Diet_Type = d.Diet_Type
            LEFT JOIN 
                Contains_Allergen ca ON mi.Menu_Item_Name = ca.Menu_Item_Name AND mi.Menu_Id = ca.Menu_Id
            LEFT JOIN 
                Allergen a ON ca.Allergen_Type = a.Allergen_Type
            WHERE 
                rlh.Latitude = :lat AND rlh.Longitude = :lon`,
            [lat, lon]);
        console.log("after connecting", result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// async function addItemToDietaryProfile(foodType, userName, profileName) {
//     // 1) Check if DietType exists,
//     // TODO: 2) IF not, add to Diet or Allergen OR REJECT????
//     // 3)
//     // const validFoodTypes = ['Vegan', 'Gluten', 'Vegetarian', 'Kosher', 'Halal'];
//     // if (!validFoodTypes.includes(foodType)) {
//     //     console.error('Invalid food type');
//     //     return false;
//     // }
//     return await withOracleDB(async (connection) => {
//
//         const result = await connection.execute(
//             `INSERT INTO Stores_${foodType}
//             (Dietary_Profile_Name, User_Username, ${foodType}_Type)
//             VALUES
//             (:profileName, :userName, :foodType)`,
//             [profileName, userName, foodType],
//             { autoCommit: true }
//         );
//
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }
//
// async function removeItemFromDietaryProfile(foodType, userName, profileName) {
//     // const validFoodTypes = ['Vegan', 'Gluten', 'Vegetarian', 'Kosher', 'Halal'];
//     // if (!validFoodTypes.includes(foodType)) {
//     //     console.error('Invalid food type');
//     //     return false;
//     // }
//
//     return await withOracleDB(async (connection) => {
//
//         const query = `
//             DELETE FROM Stores_${foodType}
//             WHERE Dietary_Profile_Name = :profileName
//               AND User_Username = :userName
//               AND ${foodType}_Type = :foodType
//         `;
// // TODO: MAKE SURE TO PROVIDE USER THE OPTION TO Pick "Allergen" or "Diet" -- CASE SENSITVIE FOR TABLE NAME
//         const result = await connection.execute(
//             query,
//             { profileName, userName, foodType },
//             { autoCommit: true }
//         );
//
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch((err) => {
//         console.error('Error removing dietary profile item:', err);
//         return false;
//     });
// }
//
//
//



/////// ores
// async function insertUserTable(Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO User_Has (Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude) VALUES (:Username, :First_Name, :Last_Name, :Email, :User_Longitude, :User_Latitude)`,
//             [Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude],
//             { autoCommit: true }
//         );
//
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }
//
// async function updateNameDemotable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         console.log("before update connecting")
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );
//
//         console.log("after update connecting")
//
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }
//
// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }



// async function fetchDemotableFromDb() {
//     return await withOracleDB(async (connection) => {
//         console.log("before connecting")
//         const result = await connection.execute('SELECT * FROM DEMOTABLE');
//         console.log("after connecting")
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchUserTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         console.log("before connecting")
//         const result = await connection.execute('SELECT * FROM User_Has');
//         console.log("after connecting")
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
//
// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }
//
//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }
//
// async function initiateUserTable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE User_Has`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }
//
//         const result = await connection.execute(`
//             CREATE TABLE User_Has (
//                 Username VARCHAR2(30) PRIMARY KEY,
//                 First_Name VARCHAR2(30),
//                 Last_Name VARCHAR2(30),
//                 Email VARCHAR2(30) NOT NULL UNIQUE,
//                 User_Longitude NUMBER(9, 6) NOT NULL,
//                 User_Latitude NUMBER(9, 6) NOT NULL,
//                 CONSTRAINT fk_user_location FOREIGN KEY (User_Longitude, User_Latitude)
//                     REFERENCES User_Location(Longitude, Latitude)
//                     ON DELETE CASCADE
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }
//
//
// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );
//
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }


module.exports = {
    testOracleConnection,
    findRestaurant,
    updateReviewContent,
    deleteReviewContent,
    fetchAllRestaurantsFromDb,
    addUserProfile,
    fetchAUserReview,
    fetchAllReviewsFromUser,
    addUserLocation
    // addItemToDietaryProfile,
    // removeItemFromDietaryProfile,
    // fetchUserTableFromDb,
    // initiateUserTable,
    // fetchDemotableFromDb,
    // initiateDemotable,
    // insertDemotable,
    // updateNameDemotable,
};
