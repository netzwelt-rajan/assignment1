require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// database
const db = require('./app/models');

db.sequelize.sync();

// check requests for cors
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// simple route
app.get('/', (req, res) => res.json({ message: 'Welcome to demo application.' }));

// routes
require('./app/routes/auth')(app);
require('./app/routes/user')(app);
require('./app/routes/page')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
