const Database = require('./dbHandler');

async function testConnection() {
  const dbHandler = new Database('mongodb+srv://ahunt3542:BP0G98dmPndJ03in@cluster0.leflomp.mongodb.net/?retryWrites=true&w=majority');

  try {
    const client = await dbHandler.connect();
    // Connection successful
    console.log('Connection test successful');
    // Perform additional operations if needed
  } catch (error) {
    // Connection failed
    console.error('Connection test failed:', error);
  } finally {
    await dbHandler.close(); // Ensure to close the connection
  }
}


testConnection();