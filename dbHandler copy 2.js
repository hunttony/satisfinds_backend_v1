const fs = require('fs');

class Database {
  constructor(loginFilePath, profileFilePath) {
    this.DB_LOGIN_FILE_PATH = loginFilePath;
    this.DB_PROFILE_FILE_PATH = profileFilePath;
    
  }

  readDataFromJsonFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data from file:', error.message);
      return []; // Return an empty array to handle read errors gracefully
    }
  }

  writeDataToJsonFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing data to file:', error.message);
    }
  }

  getUsers(filePath) {
    return this.readDataFromJsonFile(filePath);
  }

  findUserByEmail(filePath, email) {
    const users = this.getUsers(filePath);
    
    return users.find(user => user.email === email);
  }

  findUserByName(filePath, name) {
    const users = this.getUsers(filePath);
    
    return users.find(user => user.name === name);
  }
  
  addUser(filePath, user) {
    const users = this.getUsers(filePath);
    users.push(user);
    this.writeDataToJsonFile(filePath, users);
  }

  updateUser(filePath, email, updatedUserData) {
    let users = this.getUsers(filePath);
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUserData };
      this.writeDataToJsonFile(filePath, users);
      return users[index];
    } else {
      console.error('User not found');
      return null;
    }
  }

  // Add other methods as needed
}

// Usage:
const dbHandler = new Database('dbLogin.json', 'dbProfile.json');

module.exports = {
  getUsersLogin: () => dbHandler.getUsers(dbHandler.DB_LOGIN_FILE_PATH),
  getUsersProfile: () => dbHandler.getUsers(dbHandler.DB_PROFILE_FILE_PATH),
  findUserLoginByEmail: (email) => dbHandler.findUserByEmail(dbHandler.DB_LOGIN_FILE_PATH, email),
  findUserProfileByEmail: (email) => dbHandler.findUserByEmail(dbHandler.DB_PROFILE_FILE_PATH, email),
  addUserLogin: (user) => dbHandler.addUser(dbHandler.DB_LOGIN_FILE_PATH, user),
  addUserProfile: (user) => dbHandler.addUser(dbHandler.DB_PROFILE_FILE_PATH, user),
  updateUserProfileByEmail: (email, updatedUserData) => dbHandler.updateUser(dbHandler.DB_PROFILE_FILE_PATH, email, updatedUserData),
  findUserProfileByName: (name) => dbHandler.findUserByName(dbHandler.DB_PROFILE_FILE_PATH, name)
};
