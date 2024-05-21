const express = require('express');
const cors = require('cors'); 
const dbHandler = require('./dbHandler_old');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to the MongoDB database
async function connectToDatabase() {
  try {    
    const client = await dbHandler.connect(); // Connect using dbHandler
    console.log('Connected to MongoDB');
    return client; // Return the connected client instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}
connectToDatabase();

// POST route to add a contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Get the connected client
    const client = await connectToDatabase();
    
    // Query the collection containing contact data
    const contactsCollection = client.db().collection('contacts');

    // Create a new contact document
    const newContact = { name, email, message };

    // Insert the new contact document into the collection
    await contactsCollection.insertOne(newContact);

    // Send a success response
    res.status(201).json({ message: 'Message added successfully' });
  } catch (error) {
    console.error('Error adding contact:', error);
    // Send an error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add other routes similarly

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
