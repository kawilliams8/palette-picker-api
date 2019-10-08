const express = require("express");
const app = express();

const environment = process.env.NODE_ENV || 'development'; 
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

app.get('/projects', (request, response) => {
  response.send('Looks like the server is running!');
});

module.exports = app;