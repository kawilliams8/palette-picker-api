const express = require("express");
const app = express();
const regeneratorRuntime = require("regenerator-runtime");

const environment = process.env.NODE_ENV || 'development'; 
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

app.get("/", (request, response) => {
  response.send("We're going to test all the routes!");
});

app.get('/projects', async (request, response) => {
  const projects = await database("projects").select();
  return response.status(200).json(projects);
});

app.get("/palettes", async (request, response) => {
  const palettes = await database("palettes").select();
  return response.status(200).json(palettes);
});

app.get("/projects/:id", async (request, response) => {
  const project = await database("projects").where("id", request.params.id).first();
  if (project) {
    return response.status(200).json(project);
  } else {
    return response.status(404).json({error: "No project found with that id"});
  }
});

app.get("/palettes/:id", async (request, response) => {
  const palette = await database("palettes").where("id", request.params.id).first();
  if (palette) {
    return response.status(200).json(palette);
  } else {
    return response.status(404).json({error: "No palette found with that id"});
  }
});

module.exports = app;