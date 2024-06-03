const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const formHandler = require('./routes/formHandler.js');
const app = express();
const port = 5555;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the form handler route
app.use('/', formHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
