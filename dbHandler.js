const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

require('dotenv').config();

class Database {
  constructor() {
    this.uri = "mongodb+srv://ahunt3542:jcYoplkbK9ma9NxM@cluster0.9jpd4mt.mongodb.net/"
    this.client = new MongoClient(this.uri);
  }

  async connect() {
    try {
      console.log('Connecting to MongoDB...');
      await this.client.connect();
      console.log('Connected to MongoDB');
      return this.client;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    }
  }

  async storeContactForm(formData) {
    try {
      // Connect to MongoDB if not already connected
      await this.client.connect();
      console.log('Connected to MongoDB');
      
      const database = this.client.db('Contacts'); // Specify your database name
      const collection = database.collection('contactForms'); // Specify your collection name
      
      // Insert the contact form data into the collection
      await collection.insertOne(formData);

      console.log('Contact form data saved successfully');
    } catch (error) {
      console.error('Error storing contact form data:', error);
      throw error;
    }
  }

 async userSignUp(userData) {
  try {
    const LoginData = this.client.db('UserLogin'); // Update with your database name
    const loginCollection = LoginData.collection('users');

    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the number of salt rounds

    // Replace the plain password with the hashed password in the user data
    userData.password = hashedPassword;

    // Insert the user data into the 'users' collection
    await loginCollection.insertOne(userData);

    const UserProfile = LoginData.collection('profiles');

    // Insert user profile data
    await UserProfile.insertOne({ id: userData.id, email: userData.email });

  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
}

async userLogin(credentials) {
  try {
    const LoginData = this.client.db('UserLogin'); // Update with your database name
    const loginCollection = LoginData.collection('users');

    // Find the user with the provided email
    const user = await loginCollection.findOne({ email: credentials.email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(credentials.password, user.password);

      if (passwordMatch) {
        // Passwords match, return the user object
        return user;
      } else {
        // Passwords don't match
        return null;
      }
    } else {
      // User not found
      return null;
    }


  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}



async userLogin(credentials) {
  try {
    const LoginData = this.client.db('UserLogin'); // Update with your database name
    const loginCollection = LoginData.collection('users');

    // Find the user with the provided email and password
    const user = await loginCollection.findOne({ email: credentials.email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(credentials.password, user.password);

      if (passwordMatch) {
        // Passwords match, return the user object
        return user;
      } else {
        // Passwords don't match
        return null;
      }
    } else {
      // User not found
      return null;
    }

  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

async postEventForm(userEmail, eventData) {
  try {
    // Connect to MongoDB if not already connected
    await this.client.connect();
    console.log('Connected to MongoDB');
    
    const database = this.client.db('UserEvents'); // Specify your database name
    const collection = database.collection('eventForms'); // Specify your collection name
    
    // Insert the event form data into the collection
    await collection.insertOne({ userEmail, ...eventData }); // Include userEmail in the document
    console.log('Event form data saved successfully');
  } catch (error) {
    console.error('Error storing event form data:', error);
    throw error;
  }
}

async fetchAllEvents() {
  try {
    await this.client.connect(); // Connect to MongoDB if not already connected
    const database = this.client.db('UserEvents'); // Specify your database name
    const collection = database.collection('eventForms'); // Specify your collection name
    const allEvents = await collection.find({}).toArray(); // Query all documents in the collection
    return allEvents;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}


async getEventForm(userEmail) {
  try {
    await this.client.connect(); // Connect to MongoDB if not already connected
    const database = this.client.db('UserEvents'); // Specify your database name
    const collection = database.collection('eventForms'); // Specify your collection name
    const eventData = await collection.findOne({ userEmail}); // Find document by userEmail
    
    return eventData;
  } catch (error) {
    console.error('Error fetching event form data:', error);
    throw error;
  }
}

async getEventForm2(eventname) {
  try {
    await this.client.connect(); // Connect to MongoDB if not already connected
    const database = this.client.db('UserEvents'); // Specify your database name
    const collection = database.collection('eventForms'); // Specify your collection name
    const eventData = await collection.findOne({ eventname }); // Find document by userEmail
    
    return eventData;
  } catch (error) {
    console.error('Error fetching event form data:', error);
    throw error;
  }
}

async updateEventForm(userEmail, eventData) {
  try {
    await this.client.connect(); // Connect to MongoDB if not already connected
    const database = this.client.db('UserEvents');
     // Specify your database name
    const collection = database.collection('eventForms'); // Specify your collection name
    await collection.updateOne({ userEmail }, { $set: eventData }); // Update document matching userEmail
    
    console.log('Event form data updated successfully');
  } catch (error) {
    console.error('Error updating event form data:', error);
    throw error;
  }
}


async fetchAllProfiles() {
  try {
    await this.connect();
    const database = this.client.db('UserLogin'); // Update with your database name
    const collection = database.collection('profiles');
    const allUsers = await collection.find({}).toArray(); // Query all documents in the collection
    return allUsers;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}


async fetchUserProfile(userEmail) {
  try {
    await this.connect();
    const database = this.client.db('UserLogin'); // Update with your database name
    const collection = database.collection('profiles');
    const userData = await collection.findOne({ email: userEmail });    
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async fetchProfileName(userEmail) {
  try {
    await this.connect();
    const database = this.client.db('UserLogin'); // Update with your database name
    const collection = database.collection('profiles');
    const userData = await collection.findOne({ name: userEmail });    
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async updateUserProfile(userEmail, userData) {
  try {
    await this.connect();
    const database = this.client.db('UserLogin'); // Update with your database name
    const collection = database.collection('profiles');
    await collection.updateOne({ email: userEmail }, { $set: userData });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

  
  async findUserByEmail(email) {
    try {
      const userLoginDB = this.client.db('UserLogin');
      const usersCollection = userLoginDB.collection('users');

      // Find the user with the provided email
      const user = await usersCollection.findOne({ email });

      return user; // Return the user object if found, or null if not found
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }  

  

  async findUserByEmail(email) {
    try {
      const userLoginDB = this.client.db('UserLogin');
      const usersCollection = userLoginDB.collection('users');

      // Find the user with the provided email
      const user = await usersCollection.findOne({ email });

      return user; // Return the user object if found, or null if not found
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }  

  // Other methods remain unchanged
}

module.exports = new Database();
