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
        const result = await connection.execute(`
        SELECT 
            rl.Location_Name,
            rl.STREET_ADDRESS,
            rl.CITY,
            rl.PROVINCE_OR_STATE,
            rl.POSTAL_CODE,
            rl.PHONE_NUMBER,
            r.Cuisine_Type,
            ROUND(r.Average_Price, 0) AS Average_Price,
            rl.AVERAGE_RATING,
            ROUND(rl.Latitude, 6) AS Latitude,
            ROUND(rl.Longitude, 6) AS Longitude,
            COUNT(*) AS Total_Rows
        FROM 
            Restaurant_Location_Has rl
        JOIN 
            Restaurant r ON rl.Restaurant_Id = r.Id
        GROUP BY 
            rl.Location_Name,
            rl.STREET_ADDRESS,
            rl.CITY,
            rl.PROVINCE_OR_STATE,
            rl.POSTAL_CODE,
            rl.PHONE_NUMBER,
            r.Cuisine_Type,
            ROUND(r.Average_Price, 0),
            rl.AVERAGE_RATING,
            ROUND(rl.Latitude, 6),
            ROUND(rl.Longitude, 6)`,
            []  // Empty array????
        );
        console.log("after connecting", result.rows)
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
        console.log(newContent)
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

async function checkUserName(userName) {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute(
            `SELECT * FROM USER_HAS WHERE USERNAME=:userName`,
            [userName]);
        console.log("after connecting", result.rows.length)
        console.log("after connecting")
        return result.rows.length;
    }).catch(() => {
        return [];
    });
}

async function fetchMenuProfile(dietTypes, allergenTypes) {
    return await withOracleDB(async (connection) => {
        console.log("before connecting");

        // Initialize variables for WHERE and placeholders
        let whereClause = '';
        let dietCondition = '';
        let allergenCondition = '';

        // Handle diet types
        if (dietTypes.length > 0) {
            dietCondition = dietTypes.map((_, index) => `:dietCondition${index}`).join(', ');
            whereClause = `WHERE cd.DIET_TYPE IN (${dietCondition})`;
        }

        // Handle allergen types
        if (allergenTypes.length > 0) {
            allergenCondition = allergenTypes.map((_, index) => `:allergenCondition${index}`).join(', ');
        }

        const query = `
            SELECT
                mi.Menu_Name,
                r.Restaurant_Name,
                mi.PRICE
            FROM
                Contains_Diet cd
                    JOIN
                Menu_Item_On mi ON cd.Menu_Item_Name = mi.Menu_Name AND
                                   mi.MENU_ID = cd.MENU_ID
                    JOIN
                Menu_Serves ms ON mi.Menu_Id = ms.Id
                    JOIN
                Restaurant_Location_Has rlh ON ms.Restaurant_Latitude = rlh.Latitude
                                                 AND ms.Restaurant_Longitude = rlh.Longitude
                    JOIN
                Restaurant r ON r.Id = rlh.Restaurant_Id
                    JOIN
                Contains_Allergen ca ON ca.Menu_Item_Name = mi.Menu_Name AND
                                            mi.MENU_ID = ca.MENU_ID
            ${whereClause}
            GROUP BY
                mi.Menu_Name, r.Restaurant_Name, mi.PRICE
            ${allergenCondition ? `HAVING SUM(CASE WHEN ca.ALLERGEN_TYPE IN (${allergenCondition}) THEN 1 ELSE 0 END) = 0` : ''}
            ORDER BY
                mi.Menu_Name
        `;

        //console.log(query);

        const queryParams = {};

        dietTypes.forEach((type, index) => {
            queryParams[`dietCondition${index}`] = type;
        });

        allergenTypes.forEach((type, index) => {
            queryParams[`allergenCondition${index}`] = type;
        });

        //console.log(queryParams);

        try {
            const result = await connection.execute(query, queryParams);
            console.log("after connecting", result);
            return result;
        } catch (err) {
            console.error("Error executing query", err);
            return [];
        }
    });
}


async function fetchRestaurantMenuFromDb(lat, lon) {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute(`
            SELECT
                mi.Menu_Name,
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
                Contains_Diet cd ON mi.Menu_Name = cd.Menu_Item_Name AND mi.Menu_Id = cd.Menu_Id
            LEFT JOIN 
                Diet d ON cd.Diet_Type = d.Diet_Type
            LEFT JOIN 
                Contains_Allergen ca ON mi.Menu_Name = ca.Menu_Item_Name AND mi.Menu_Id = ca.Menu_Id
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


module.exports = {
    testOracleConnection,
    findRestaurant,
    updateReviewContent,
    deleteReviewContent,
    fetchAllRestaurantsFromDb,
    addUserProfile,
    fetchAUserReview,
    fetchAllReviewsFromUser,
    addUserLocation,
    fetchRestaurantMenuFromDb,
    fetchMenuProfile,
    checkUserName

};
