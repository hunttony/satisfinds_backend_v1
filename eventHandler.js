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

  
async fetchAllEvents() {
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


async fetchUserEvents(userEmail) {
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

async fetchEventName(userEmail) {
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

async updateUserEvent(userEmail, userData) {
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

  



  

  // Other methods remain unchanged
}

module.exports = new Database();
