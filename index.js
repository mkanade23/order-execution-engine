// index.js

// 1. Import the Express module
const express = require('express');

// 2. Initialize the app
const app = express();

// 3. Define the port the server will run on
const port = 3000;

// 4. Define a simple route (the homepage/root path)
app.get('/', (req, res) => {
  // This sends a response back to the client
  res.send('Hello from the Eterna Express Server!');
});

// 5. Start the server and listen for connections
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});