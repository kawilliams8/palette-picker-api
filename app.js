const express = require('express');
const cors = require('cors');
const app = express();
const regeneratorRuntime = require('regenerator-runtime');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(cors());
app.use(express.json());

// const whitelist = ['http://localhost:3000'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }


app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!');
});

app.get('/api/v1/projects', async (request, response) => {
  const projects = await database('projects').select();
  return response.status(200).json(projects);
});

app.get('/api/v1/palettes', async (request, response) => {
  const palettes = await database('palettes').select();
  const hex = request.query.hex ? request.query.hex.toUpperCase() : null;

  if (hex) {
    const foundPalettes = await database('palettes')
    .where("hex_1", `#${hex}`)
    .orWhere("hex_2", `#${hex}`)
    .orWhere("hex_3", `#${hex}`)
    .orWhere("hex_4", `#${hex}`)
    .orWhere("hex_5", `#${hex}`)
    .select();
    if (foundPalettes.length) {
      return response.status(200).json(foundPalettes)
    } else {
      return response.status(404).json({ error: 'No palette with that hex code found.'})
    }
  }
  return response.status(200).json(palettes);
});

app.get('/api/v1/projects/:id', async (request, response) => {
  const project = await database('projects').where('id', request.params.id).first();
  if (project) {
    return response.status(200).json(project);
  } else {
    return response.status(404).json({error: 'No project found with that id'});
  }
});

app.get('/api/v1/palettes/:id', async (request, response) => {
  const palette = await database('palettes').where('id', request.params.id).first();
  if (palette) {
    return response.status(200).json(palette);
  } else {
    return response.status(404).json({error: 'No palette found with that id'});
  }
});

app.post('/api/v1/projects', async (request, response) => {
  const project = request.body;
  const duplicateProject = await database('projects').where('project', 'like', `%${project.project}%`);
  if (!project.project) {
    return response 
      .status(422)
      .send({
        error: `Expected format: {
          project: <String>
        }. You are missing a "project" property.`})
  } else if (duplicateProject.length) {
    return response
      .status(400)
      .send({
        error: 'Duplicate project name. Please choose another name.'
      });
  }

  const insertedProject = await database('projects').insert(project, 'id');

  if (insertedProject.length) {
    return response.status(201).json({ id: insertedProject[0] })
  } else {
    return response.status(422).json({ error: 'Failed to post project!'})
  }
});

app.post('/api/v1/palettes', async (request, response) => {
  const palette = {};
  Object.keys(request.body).forEach(key => {
    if (key.includes('hex')) {
      palette[key] = request.body[key].toUpperCase();
    } else {
      palette[key] = request.body[key]
    }
  });

  for (let requiredParameter of ['palette', 'hex_1', 'hex_2', 'hex_3', 'hex_4', 'hex_5', 'project_name']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: {
          palette: <String>,
          hex_1: <String>,
          hex_2: <String>,
          hex_3: <String>,
          hex_4: <String>,
          hex_5: <String>,
          project_name: <String>
        }. You are missing a "${requiredParameter}" property.`
        })
    }
  }

  const insertedPalette = await database('palettes').insert(palette, 'id');

  if (insertedPalette.length) {
    return response.status(201).json({ id: insertedPalette[0] })
  } else {
    return response.status(422).json({ error: 'Failed to post palette!' })
  }
});

app.patch('/api/v1/projects/:id', async (request, response) => {
  const project = request.body;
  const foundProjects = await database('projects').where('id', request.params.id).select();

  if (!project.project) {
    return response
      .status(422)
      .send({
        error: `Expected format: {
        project: <String>
        }. You are missing a "project" property.`})
  }
  if (!foundProjects.length) {
    return response
      .status(422)
      .send({
        error: 'Did not find any projects with that id.'
      })
  }

  await database('palettes').where('project_id', request.params.id).update({ project_name: project.project });
  await database('projects').where('id', request.params.id).update({project: project.project});
  return response.status(201).json(`Project with id ${request.params.id} has been successfully updated.`);
});

app.patch('/api/v1/palettes/:id', async (request, response) => {
  const palette = {};
  Object.keys(request.body).forEach(key => {
    if (key.includes('hex')) {
      palette[key] = request.body[key].toUpperCase();
    } else {
      palette[key] = request.body[key]
    }
  });
  const foundPalettes = await database('palettes').where('id', request.params.id).first();

  for (let requiredParameter of ['palette', 'hex_1', 'hex_2', 'hex_3', 'hex_4', 'hex_5', 'project_name']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: {
          palette: <String>,
          hex_1: <String>,
          hex_2: <String>,
          hex_3: <String>,
          hex_4: <String>,
          hex_5: <String>,
          project_name: <String>
        }. You are missing a "${requiredParameter}" property.`
        })
    }
  }
  if (!foundPalettes) {
    return response
      .status(422)
      .send({
        error: 'Did not find any palettes with that id.'
      })
  }

  await database('palettes').where('id', request.params.id).update(palette);
  return response.status(201).json(`Palette with id ${request.params.id} has been successfully updated.`);
});

app.delete('/api/v1/projects/:id', async (request, response) => {
  await database('palettes').where('project_id', request.params.id).del();
  const deletedProject = await database('projects').where('id', request.params.id).del();

  if(deletedProject) {
    response.status(204).send();
  } else {
    response.status(404).json({ error: `No project with id ${request.params.id}` })
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const deletedPalette = await database('palettes').where('id', request.params.id).del();

  if (deletedPalette) {
    response.status(204).send();
  } else {
    response.status(404).json({ error: `No palette with id ${request.params.id}` })
  }
});

module.exports = app; 