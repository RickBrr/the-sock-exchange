import express from 'express';
import { promises as fs } from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;
// PostgreSQL pool configuration
const pool = new Pool({
    user: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: 'postgres',
    port: 5432,
});

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB;
const collectionName = process.env.MONGO_DB_COLLECTION;

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = 3000;

// Endpoint to read and send JSON file content
app.get('/socks', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const socks = await collection.find({}).toArray();
        res.json(socks);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Hmmm, something smells... No socks for you! ☹");
    }
});

app.get('/socks/:color', async (req, res) => {
    try {
        // Console log the entire request object
        console.log(req);

        // Console log specific parts of the request
        console.log("Headers:", req.headers);
        console.log("URL:", req.url);
        console.log("Method:", req.method);
        console.log("Query parameters:", req.query);

        const {color} = req.params;
        const data = await fs.readFile('../data/socks.json', 'utf8');
        const jsonObj = JSON.parse(data);
        const result = jsonObj.filter(sock => sock.color.toUpperCase() === color.toUpperCase());
        if (result.length === 0) {
            return res.status(404).send("There were no socks of that color. :(");
        }
        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Hmmm, something smells... No socks for you! ☹");
    }
});

app.get('/socks/:page/:limit', async (req, res) => {
    try {
        let { page, limit } = req.params;
        limit = +limit; // The + converts limit from a string to integer.
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const socks = await collection.find({}).skip((page - 1) * limit).limit(limit).toArray();
        res.json(socks);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Hmm, something doesn\'t smell right... Error fetching socks');
    }
});

// app.post('/socks', async (req, res) => {
//     try {
//         // Obligatory reference to POST Malone
//         console.log("If POST Malone were a sock, he'd be the one with the most colorful pattern.");
//         // Simulate creating a user
//         const { username, email } = req.body;
//         if (!username || !email) {
//             // Bad request if username or email is missing
//             return res.status(400).send({ error: 'Username and email are required.' });
//         }

//         // Respond with the created user information and a 201 Created status
//         res.status(201).send({
//             status: 'success',
//             location: 'http://localhost:3000/users/1234', // This URL should point to the newly created user
//             message: 'User created successfully.'
//         });
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send("Hmmm, something smells... No socks for you! ☹");
//     }
//});

app.post('/socks/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT uid FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.status(200).json({ uid: result.rows[0].uid });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/socks/search', async (req, res) => {
    try {
        // TODO: Add code that can search MongoDB based on a color value
        const {searchTerm} = req.body;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const socks = await collection.find({"sockDetails.color": searchTerm}).toArray();
        res.json(socks);
        // from the Search text box.
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Hmm, something doesn\'t smell right... Error searching for socks');
    }
});

app.post('/socks', async (req, res) => {
    try {
        // TODO: Add code that adds a sock when a new sock is posted using the
        const sock = req.body;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(sock);
        res.status(201).send(`{"_id":"${result.insertedId}"}`);
        // Add Sock form.
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Hmm, something doesn\'t smell right... Error adding sock');
    }
});

// app.delete('/socks/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log('Deleting sock with ID:', id);
//         res.status(200).send('Sock deleted successfully');
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).send('Hmm, something doesn\'t smell right... Error deleting sock');
//     }
// });

app.delete('/socks/:id', async (req, res) => {
    try {
        // TODO: Add code that delete a sock when its delete button is clicked.
        const {id} = req.params;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        //const socks = await collection.find({"sockDetails.color": searchTerm}).toArray();
        const result = await collection.deleteOne({_id: new ObjectId(id)});
        if (result.deletedCount === 1) {
            res.status(200).send('Sock deleted successfully');
        } else {
            res.status(404).send('Sock not found');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Hmm, something doesn\'t smell right... Error deleting sock');
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        console.log('Updating email for user with ID:', id);
        res.status(200).send({
            status: 'success',
            data: email, // This URL should point to the newly created user
            message: 'User updated successfully.'
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Hmm, something doesn\'t smell right... Error deleting sock');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
