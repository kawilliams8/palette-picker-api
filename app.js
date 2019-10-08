import express from 'express';
const app = express();

const environment = process.env.NODE_ENV || 'development'; 
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Looks like the server is running!');
});

export default app; 