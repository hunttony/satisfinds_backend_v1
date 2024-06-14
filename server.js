const express = require('express');
const dbHandler = require('./dbHandler');

const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '50mb'}));
const corsOptions = {
  origin: 'http://localhost:3000', // Allow your local development origin
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

async function checkMongoDBConnection() {
  try {
    // Connect to MongoDB
    const client = await dbHandler.connect();

    // Check if the client is connected
    if (!client.isConnected()) {
      throw new Error('MongoDB client is not connected');
    }

    // Get a list of collections in the database
    const database = client.db();
    const collections = await database.listCollections().toArray();

    // Extract collection names
    const collectionNames = collections.map(collection => collection.name);

    console.log('MongoDB connection and collection retrieval successful');
    return { status: 'MongoDB connected', collections: collectionNames };
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    throw error;
  } finally {
    await dbHandler.client.close(); // Close the MongoDB client
  }
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Store the contact form data in MongoDB
    await dbHandler.storeContactForm({ name, email, message });

    res.status(200).json({ success: true, message: 'Contact form data saved successfully' });
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await dbHandler.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }


    // Store the signup data in the 'users' collection
    await dbHandler.userSignUp({ email, password });

    res.status(200).json({ success: true, message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists and credentials are correct
    const user = await dbHandler.userLogin({ email, password });

    if (user) {
      res.status(200).json({ success: true, message: 'Login successful', user });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/links/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
 
  
  try {
    const userData = await dbHandler.fetchProfileName(userEmail); // Pass userEmail as parameter
   
    if (!userData) {
      // If user data not found, return 404 Not Found
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/links', async (req, res) => {
  
  try {
    const userData = await dbHandler.fetchAllProfiles();
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const userData = await dbHandler.fetchUserProfile(userEmail);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update user profile data
app.put('/profile/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  const userData = req.body;
  try {
    await dbHandler.updateUserProfile(userEmail, userData);
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/events/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  const eventData = req.body; // Corrected variable name
  try {
    await dbHandler.postEventForm(userEmail, eventData);
    res.status(200).json({ message: 'Event data posted successfully' }); // Corrected response message
  } catch (error) {
    console.error('Error posting event data:', error); // Corrected error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/events/:eventname', async (req, res) => {
  const eventname = req.params.eventname;
  try {
    const eventData = await dbHandler.getEventForm2(eventname); // Removed unnecessary eventData variable
   
    res.status(200).json(eventData); // Sending eventData as response
  } catch (error) {
    console.error('Error fetching event data:', error); // Corrected error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/event/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const eventData = await dbHandler.getEventForm(userEmail); // Removed unnecessary eventData variable
   
    res.status(200).json(eventData); // Sending eventData as response
  } catch (error) {
    console.error('Error fetching event data:', error); // Corrected error message
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/events/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  const eventData = req.body; // Corrected variable name
  try {
    await dbHandler.updateEventForm(userEmail, eventData);
    res.status(200).json({ message: 'Event data updated successfully' }); // Corrected response message
  } catch (error) {
    console.error('Error updating event data:', error); // Corrected error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/events', async (req, res) => {
  
  try {
    const userEvents = await dbHandler.fetchAllEvents();
    res.status(200).json(userEvents);
  } catch (error) {
    console.error('Error fetching user event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
  app.get('/status', async (req, res) => {
    try {
      // Check MongoDB connection status
      console.log('Checking MongoDB connection...');
      const isConnected = await checkMongoDBConnection();
      if (isConnected) {
        console.log('MongoDB connected');
        res.status(200).json({ status: 'MongoDB connected' });
      } else {
        console.log('MongoDB connection failed');
        res.status(500).json({ error: 'MongoDB connection failed' });
      }
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  let cursor; // Define a global cursor variable to keep track of the current position
  
  app.get('/nextDocument', async (req, res) => {
    try {
      // If cursor is undefined or has reached the end, initialize a new cursor
      if (!cursor || !(await cursor.hasNext())) {
        console.log('Initializing cursor...');
        cursor = await dbHandler.getCursor('listingsAndReviews');
      }
  
      // Retrieve the next document from the cursor
      const document = await cursor.next();
  
      if (document) {
        console.log('Retrieved document:', document);
        res.status(200).json(document);
      } else {
        console.log('No more documents available');
        res.status(404).json({ error: 'No more documents available' });
      }
    } catch (error) {
      console.error('Error retrieving document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/getDocument/:collectionName/:id', async (req, res) => {
    try {
      const collectionName = req.params.collectionName;
      const documentId = req.params.id;
      console.log(`Retrieving document with ID ${documentId} from collection ${collectionName}`);
  
      // Call a function to retrieve the document by ID
      const document = await dbHandler.getDocumentById(collectionName, documentId);
      console.log('Retrieved document:', document);
  
      if (document) {
        res.status(200).json({ status: 'Document retrieved successfully', document });
      } else {
        res.status(404).json({ error: 'Document not found' });
      }
    } catch (error) {
      console.error('Error retrieving document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/check', async (req, res) => {
    try {
      console.log('Checking MongoDB connection and retrieving documents...');
      const documents = await dbHandler.getUsers('listingsAndReviews');
      console.log('Retrieved documents:', documents);
  
      const result = {
        status: 'MongoDB connected',
        documents: documents
      };
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/check1/:collectionName/:id', async (req, res) => {
    try {
      const collectionName = req.params.collectionName;
      const documentId = req.params.id;
      console.log(`Checking MongoDB connection and retrieving document with ID ${documentId} from collection ${collectionName}...`);
      const document = await dbHandler.getDocumentById(collectionName, documentId);
      console.log('Retrieved document:', document);
  
      const result = {
        status: 'MongoDB connected',
        document: document
      };
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
*/

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
