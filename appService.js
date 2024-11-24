const oracledb = require('oracledb');
//import oracledb from "oracledb"
const loadEnvFile = require('./utils/envUtil');
//const envVariables = loadEnvFile('./.env');
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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        console.log("after connecting")
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUserTableFromDb() {
    return await withOracleDB(async (connection) => {
        console.log("before connecting")
        const result = await connection.execute('SELECT * FROM User_Has');
        console.log("after connecting")
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateUserTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE User_Has`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE User_Has (
                Username VARCHAR2(30) PRIMARY KEY,
                First_Name VARCHAR2(30),
                Last_Name VARCHAR2(30),
                Email VARCHAR2(30) NOT NULL UNIQUE,
                User_Longitude NUMBER(9, 6) NOT NULL,
                User_Latitude NUMBER(9, 6) NOT NULL,
                CONSTRAINT fk_user_location FOREIGN KEY (User_Longitude, User_Latitude)
                    REFERENCES User_Location(Longitude, Latitude)
                    ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}


async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function insertUserTable(Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO User_Has (Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude) VALUES (:Username, :First_Name, :Last_Name, :Email, :User_Longitude, :User_Latitude)`,
            [Username, First_Name, Last_Name, Email, User_Longitude, User_Latitude],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        console.log("before update connecting")
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        console.log("after update connecting")

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function updateReviewContent(oldContent, newContent, columnName, userName, restLong, restLat) {
    // BE SURE TO ONLY BE ABLE TO UPDATE THE FOLOWING COLUMNS: Content (VARCHAR2),
    // Rating (0 - 5)
    return await withOracleDB(async (connection) => {
        console.log("before update connecting")
        const validColumns = ['Content', 'Rating'];
        if (!validColumns.includes(columnName)) {
            throw new Error('Invalid column name');
        }
        const result = await connection.execute(
            `UPDATE Review_For_Makes 
            SET 
            ${columnName}=:newContent,
            Record_Date = SYSDATE,              
            Record_Time = SYSTIMESTAMP 
            where 
            ${columnName}=:oldContent 
            AND Username=:userName 
            AND RESTAURANT_LONGITUDE=:restLong 
            AND Restaurant_Latitude=:restLat`,
            [newContent, oldContent, userName, restLong, restLat],
            { autoCommit: true }
        );

        console.log("after update connecting")

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteReviewContent(content, userName, restLong, restLat) {
    // TODO: when writing api endpoint of deleting user name, also delete all review associated
    return await withOracleDB(async (connection) => {
        console.log("before delete connecting");

        const result = await connection.execute(
            `DELETE FROM Review_For_Makes
            WHERE Content = :content
              AND Username = :userName
              AND Restaurant_Longitude = :restLong
              AND Restaurant_Latitude = :restLat`,
            [content, userName, restLong, restLat],
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


async function addItemToDietaryProfile(foodType, userName, profileName) {
    // 1) Check if DietType exists,
    // TODO: 2) IF not, add to Diet or Allergen OR REJECT????
    // 3)
    // const validFoodTypes = ['Vegan', 'Gluten', 'Vegetarian', 'Kosher', 'Halal'];
    // if (!validFoodTypes.includes(foodType)) {
    //     console.error('Invalid food type');
    //     return false;
    // }
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `INSERT INTO Stores_${foodType} 
            (Dietary_Profile_Name, User_Username, ${foodType}_Type) 
            VALUES  
            (:profileName, :userName, :foodType)`,
            [profileName, userName, foodType],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function removeItemFromDietaryProfile(foodType, userName, profileName) {
    // const validFoodTypes = ['Vegan', 'Gluten', 'Vegetarian', 'Kosher', 'Halal'];
    // if (!validFoodTypes.includes(foodType)) {
    //     console.error('Invalid food type');
    //     return false;
    // }

    return await withOracleDB(async (connection) => {

        const query = `
            DELETE FROM Stores_${foodType} 
            WHERE Dietary_Profile_Name = :profileName
              AND User_Username = :userName
              AND ${foodType}_Type = :foodType
        `;
// TODO: MAKE SURE TO PROVIDE USER THE OPTION TO Pick "Allergen" or "Diet" -- CASE SENSITVIE FOR TABLE NAME
        const result = await connection.execute(
            query,
            { profileName, userName, foodType },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('Error removing dietary profile item:', err);
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





module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable,
    findRestaurant,
    fetchUserTableFromDb,
    initiateUserTable,
    updateReviewContent,
    addItemToDietaryProfile,
    removeItemFromDietaryProfile,
    deleteReviewContent,
    fetchAllRestaurantsFromDb
};
