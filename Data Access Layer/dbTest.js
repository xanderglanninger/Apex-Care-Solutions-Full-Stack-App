//node dbTest.js
const db = require('./dbConnection.js');
const fs = require('fs');
const path = require('path');

// Load JSON data from a file, e.g., 'clientData.json'
function addClientsFromJSON(callback) {
    fs.readFile('client.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return callback(err);
        }
        
        let clients;
        try {
            // Parse JSON data
            clients = JSON.parse(data);
            console.log("Parsed client details:", clients); // Log parsed data
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return callback(parseError);
        }

        // Insert each client and collect the results
        const results = [];
        let completed = 0;

        clients.forEach(clientDetails => {
            db.addClient(clientDetails, (error, result) => {
                completed++;
                
                if (error) {
                    console.error('Error inserting client:', error);
                    results.push({ client: clientDetails, success: false, error });
                } else {
                    console.log('Client added successfully:', result);
                    results.push({ client: clientDetails, success: true, result });
                }

                // Call the callback once all clients have been processed
                if (completed === clients.length) {
                    callback(null, results);
                }
            });
        });
    });
}

function addTechniciansFromJSON(callback) {
    fs.readFile('technicianinfo.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return callback(err);
        }
        
        let technicians;
        try {
            // Parse JSON data
            technicians = JSON.parse(data);
            console.log("Parsed technicians details:", technicians); // Log parsed data
        } catch (parseError) {
            console.error('Error parsing JSON:', technicians);
            return callback(parseError);
        }

        // Insert each technicians and collect the results
        const results = [];
        let completed = 0;

        technicians.forEach(technicianDetails => {
            db.addTechnician(technicianDetails, (error, result) => {
                completed++;
                
                if (error) {
                    console.error('Error inserting technicians:', error);
                    results.push({ technician: technicianDetails, success: false, error });
                } else {
                    console.log('Technician added successfully:', result);
                    results.push({ technician: technicianDetails, success: true, result });
                }

                // Call the callback once all technicians have been processed
                if (completed === technicians.length) {
                    callback(null, results);
                }
            });
        });
    });
}

db.getAllTechnicians((err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
});

addTechniciansFromJSON((err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
});