// db.js
const mysql = require('mysql2');

// Create a MySQL connection pool (better for multiple queries)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ApexCare123',
    database: 'apexcare'
});

//==============================READ OPERATIONS==============================================
// Encapsulate the query to fetch all contracts in a function
function getAllContracts(callback) {
    const query = "SELECT *, DATE_FORMAT(startDate, '%Y-%m-%d') as startDate FROM contract;";
    
    pool.query(query, function(err, results) {
        if (err) {
            return callback(err, null);  // Pass error back to the callback
        }
        callback(null, results);  // Pass results back to the callback
    });
}

// Another function to get all technicians (example)
function getAllTechnicians(callback) {
    const query = "SELECT * FROM technicians;";
    
    pool.query(query, function(err, results) {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getAllClients(callback) {
    const query = "SELECT * FROM clients;";
    
    pool.query(query, function(err, results) {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

//==============================CREATE OPERATIONS==============================================
function addContract(contractDetails, callback) {
    const query = "INSERT INTO contracts (clientID, typeofjob, contracttype, timePeriod, startDate, contractName, location, techID, finished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(query, [contractDetails.clientID, contractDetails.typeofjob, contractDetails.contracttype, contractDetails.timePeriod, contractDetails.startDate, contractDetails.contractName, contractDetails.location, contractDetails.techID, contractDetails.finished], function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

function addClient(clientDetails, callback) {
    const query = "INSERT INTO clients (name, surname, email, phone, location) VALUES (?, ?, ?, ?, ?)";

    pool.query(query, [clientDetails.name, clientDetails.surname, clientDetails.email, clientDetails.phone, clientDetails.location], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result)
    });
}

function addTechnician(technicianDetails, callback) {
    const query = "INSERT INTO technicians (name, surname, location, available, category, skill_level, phone) VALUES (?, ?, ?, ?, ?, ?, ?)";

    pool.query(query, [technicianDetails.name, technicianDetails.surname, technicianDetails.location, technicianDetails.available, technicianDetails.category, technicianDetails.skill_level, technicianDetails.phone], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result)
    });
}

//==============================UPDATE OPERATIONS==============================================
function updateContracts(contractID, updatedDetails, callback) {
    const query = `
        UPDATE contracts
        SET clientID = ?, 
            typeofjob = ?, 
            contracttype = ?, 
            timePeriod = ?, 
            startDate = ?, 
            contractName = ?, 
            location = ?, 
            techID = ?, 
            finished = ? 
        WHERE contractID = ?;
    `;
    
    // Array of values to be updated
    const values = [
        updatedDetails.clientID, 
        updatedDetails.typeofjob, 
        updatedDetails.contracttype, 
        updatedDetails.timePeriod, 
        updatedDetails.startDate, 
        updatedDetails.contractName, 
        updatedDetails.location, 
        updatedDetails.techID, 
        updatedDetails.finished, 
        contractID
    ];

    pool.query(query, values, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

function updateClients(clientID, updatedDetails, callback) {
    const query = `
        UPDATE clients 
        SET name = ?,
        surname = ?,
        email = ?,
        phone = ?,
        location = ?
        WHERE clientID = ?;
    `;
    
    // Array of values to be updated
    const values = [
        updatedDetails.name, 
        updatedDetails.surname, 
        updatedDetails.email, 
        updatedDetails.phone, 
        updatedDetails.location,
        clientID
    ];

    pool.query(query, values, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

function updateTechnicians(techID, updatedDetails, callback) {
    const query = `
        UPDATE clients 
        SET name = ?,
        surname = ?,
        location = ?,
        available = ?,
        category = ?,
        skill_level = ?,
        phone = ?,
        usernames = ?,
        WHERE techID = ?;
    `;
    
    // Array of values to be updated
    const values = [
        updatedDetails.name, 
        updatedDetails.surname, 
        updatedDetails.location, 
        updatedDetails.available, 
        updatedDetails.category,
        updatedDetails.skill_level,
        updatedDetails.phone,
        updatedDetails.username,
        techID
    ];

    pool.query(query, values, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}
//==============================DELETE OPERATIONS==============================================
function deleteContract(contractID, callback) {
    const query = "DELETE FROM contracts WHERE contract)_id = " + contractID + ";";

    pool.query(query, contractID, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

function deleteClient(clientID, callback) {
    const query = "DELETE FROM clients WHERE id = " + clientID + ";";

    pool.query(query, clientID, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

function deleteTechnician(techID, callback) {
    const query = "DELETE FROM technicians WHERE id = " + techID + ";";

    pool.query(query, techID, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}
// Export the methods so they can be used in other parts of the application
module.exports = {
    getAllContracts,
    getAllTechnicians,
    getAllClients, 
    addContract,
    addClient, 
    addTechnician,
    updateContracts,
    updateClients,
    updateTechnicians,
    deleteContract,
    deleteClient, 
    deleteTechnician
};
