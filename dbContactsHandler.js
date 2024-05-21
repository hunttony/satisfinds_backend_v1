const fs = require('fs');

class Database {
  constructor(contactsFilePath) {
    this.DB_CONTACTS_FILE_PATH = contactsFilePath;
  }
   
  addContact(data) {
    const contactPath = this.DB_CONTACTS_FILE_PATH;
    try {
      // Read existing contacts from the file
      const existingData = fs.readFileSync(contactPath);
      let parsedData = [];
      if (existingData) {
        parsedData = JSON.parse(existingData);
      }
  
      // Ensure parsedData is an array
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
      
      // Append new contact data to the existing data
      parsedData.push(data);
      
      // Write the combined data back to the file
      fs.writeFileSync(contactPath, JSON.stringify(parsedData, null, 2));
    } catch (error) {
      console.error('Error writing data to file:', error.message);
    }
  }
}

const dbContactsHandler = new Database('dbContacts.json');

module.exports = dbContactsHandler;
