const oracledb = require('oracledb');
// import oracledb from "oracledb"
// import loadEnvFile from './utils/envUtil.js';
//const envVariables = loadEnvFile('./.env');
const loadEnvFile = require('./utils/envUtil');

 const envVariables = loadEnvFile('./.env');


// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
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

async function loadExcelFileToOracle(filePath) {
    const workbook = xlsx.readFile(filePath);
    console.log(`Loading data from ${filePath}...`);

    // go through each sheet in excel file
    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        // turn excel sheets to JSON file
        const data = xlsx.utils.sheet_to_json(sheet, { defval: null });

        // use sheet name = table name
        const tableName = sheetName.replace(/\s+/g, '_').toUpperCase();
        // taking each column and turning them to valid SQL column names with undescores
        // TODO: modify to split last bit of name that is indication data type
        const columns = Object.keys(data[0]).map(col => col.replace(/\s+/g, '_'));
        console.log(`All column names:  ${columns}`)

        //TODO: Include naming convention to include type in column name
        const columnDefinitions = columns.map(col => `${col} VARCHAR2(255)`).join(', ');
        const placeholders = columns.map((_, index) => `:col${index + 1}`).join(', ');

        await withOracleDB(async (connection) => {
            // drop existing table from past use
            try {
                await connection.execute(`BEGIN EXECUTE IMMEDIATE 'DROP TABLE ${tableName}'; EXCEPTION WHEN OTHERS THEN NULL; END;`);
                console.log(`Dropped table ${tableName} if it existed.`);
            } catch (err) {
                console.error(`Error dropping table ${tableName}:`, err);
            }

            // create new table
            const createTableSQL = `CREATE TABLE ${tableName} (${columnDefinitions})`;
            await connection.execute(createTableSQL);
            console.log(`Created table ${tableName}.`);

            // insert data into the table
            const insertSQL = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
            const insertRows = data.map(row => columns.map(col => row[col] || null)); 

            await connection.executeMany(insertSQL, insertRows.map(row => {
                return row.reduce((acc, val, idx) => ({ ...acc, [`col${idx + 1}`]: val }), {});
            }), { autoCommit: false });

            // commit after inserting all rows for the table
            await connection.commit();
            console.log(`Loaded data into ${tableName} from sheet ${sheetName}.`);
        });
    }
    console.log('All sheets have been loaded into Oracle DB.');
}

async function findMenuItem(foodName, menuID) {
    
}

async function findRestaurant(locationName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Location_Name, Street_Address, Postal_Code, Phone_Number, Average_Rating 
            FROM Restaurant_Location_Has WHERE Location_Name=:LocationName `
        );

        console.log("after update connecting")

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    loadExcelFileToOracle,
    findMenuItem,
    findRestaurant

};
