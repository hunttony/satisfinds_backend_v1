const { MongoClient } = require('mongodb');
require('dotenv').config();


class Database {
  constructor(uri) {
    this.uri = uri;
   
    this.client = new MongoClient(this.uri);
  }

  async connect() {
    try {            
      await this.client.connect();
      console.log('Connected to MongoDB');
      return this.client; // Return the connected client instance
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    }
  }       

  async getUsers(collectionName) {
    try {
      const database = this.client.db();
      const collection = database.collection(collectionName);
      const users = await collection.find({}).toArray();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  }

  async getUsers(collectionName, query = {}) {
    try {
      // Connect to MongoDB
      await this.client.connect();
      console.log('Connected to MongoDB');
    
      const database = this.client.db('<dbName>');
      const collection = database.collection(collectionName);
    
      // Query documents from the collection
      const documents = await collection.find(query).toArray();
      console.log('Documents:', documents);
      
      return documents;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      await this.client.close();
      console.log('Disconnected from MongoDB Atlas');
    }
  }
  

  async findUserByEmail(collectionName, email) {
    try {
      const database = this.client.db();
      const collection = database.collection(collectionName);
      const user = await collection.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw error;
    }
  }

  async addUser(collectionName, user) {
    try {
      const database = this.client.db();
      const collection = database.collection(collectionName);
      await collection.insertOne(user);
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error.message);
      throw error;
    }
  }

  async updateUser(collectionName, filter, update) {
    try {
      const database = this.client.db();
      const collection = database.collection(collectionName);
      const result = await collection.updateOne(filter, { $set: update });
      console.log(`${result.modifiedCount} user(s) updated`);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  }

  // Add other methods as needed
}

// Usage:
const dbHandler = new Database(process.env.MONGODB_URI);

module.exports = dbHandler;
