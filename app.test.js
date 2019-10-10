const request = require('supertest');
const app = require('./app');
const regeneratorRuntime = require('regenerator-runtime');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {

  beforeEach( async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /projects', () => {
    it('should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select();
      const response = await request(app).get('/projects');
      const projects = response.body;
      expect(response.status).toBe(200);
      expect(JSON.stringify(projects)).toEqual(JSON.stringify(expectedProjects));
    });
  });

  describe('GET /palettes', () => {
    it('should return a 200 and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select();
      const response = await request(app).get('/palettes');
      const palettes = response.body;
      expect(response.status).toBe(200);
      expect(JSON.stringify(palettes)).toEqual(JSON.stringify(expectedPalettes));
    });
  });

  describe('GET /projects/:id', () => {
    it('should return a 200 and one matching project', async () => {
      const expectedProject = await database('projects').first();
      const id = expectedProject.id;

      const response = await request(app).get(`/projects/${id}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedProject));
    });

    it('should return a 404 and the error "No project found with that id"', async () => {
      const invalidID = -1;
      const response = await request(app).get(`/projects/${invalidID}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('No project found with that id');
    });
  });

  describe('GET /palettes/:id', () => {
    it('should return a 200 and one matching palette', async () => {
      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;

      const response = await request(app).get(`/palettes/${id}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedPalette));
    });

    it('should return a 404 and the error "No palette found with that id"', async () => {
      const invalidID = -1;
      const response = await request(app).get(`/palettes/${invalidID}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('No palette found with that id');
    });
  });

  describe('POST /projects', () => {
    it('should successfully post a new project to the db', async () => {
      const newProject = { project: "TestPost"}
      const res = await request(app).post('/projects').send(newProject);
      const project = await database('projects').where('project', 'like',  `%${newProject.project}%`).first();

      expect(res.status).toBe(201);
      expect(project.project).toEqual(newProject.project);
    });

    it('should return a 422 and a message "Request body is missing a parameter"', async () => {
      const newProject = { fake: 'fake' }

      const res = await request(app).post('/projects').send(newProject); 

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual(
        `Expected format: {
          project: <String>
        }. You are missing a "project" property.`
      );
    });

    it('should return a 400 and a message "Duplicate project name. Please choose another name."', async () => {
      const newProject = { project: 'Project_One' };

      const res = await request(app).post('/projects').send(newProject);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Duplicate project name. Please choose another name.')
    });
  });

  describe('POST /palettes', () => {
    it('should successfully post a new palette to the db', async () => {
      const newPalette = { 
        palette: "Strawberry shortcake", 
        hex_1: "EFEFEF", 
        hex_2: "EFEFEF", 
        hex_3: "EFEFEF", 
        hex_4: "EFEFEF", 
        hex_5: "EFEFEF",
        project_name: "Project_One"
      }
      const res = await request(app).post('/palettes').send(newPalette);
      const palette = await database('palettes').where('palette', 'like', `%${newPalette.palette}%`).first();

      expect(res.status).toBe(201);
      expect(palette.palette).toEqual(newPalette.palette);
    });

    it('should return a 422 and a message "Request body is missing a parameter"', async () => {
      const newPalette = {
        palette: "Strawberry shortcake",
        hex_1: "EFEFEF",
        hex_2: "EFEFEF",
        hex_3: "EFEFEF",
        hex_5: "EFEFEF",
        project_name: "Project_One"
      }

      const res = await request(app).post('/palettes').send(newPalette);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual(
        `Expected format: {
          palette: <String>,
          hex_1: <String>,
          hex_2: <String>,
          hex_3: <String>,
          hex_4: <String>,
          hex_5: <String>,
          project_name: <String>
        }. You are missing a "hex_4" property.`
      );
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update an existing project and all associated palette project names', async () => {
      const replacementProject = { project: 'NewName' };
      const projectToReplace = await database('projects').first();
      const id = projectToReplace.id;
      const res = await request(app).patch(`/projects/${id}`).send(replacementProject);
      const testPalettes = await database('palettes').select();
      expect(res.status).toBe(201)
      expect(res.body).toEqual(`Project with id ${id} has been successfully updated.`);
    });

    it('should return status 422 and a message "Missing project name"', async () => {
      const replacementProject = { blib: 'Blob' };
      const projectToReplace = await database('projects').first();
      const id = projectToReplace.id;
      const res = await request(app).patch(`/projects/${id}`).send(replacementProject);
      
      expect(res.status).toBe(422)
      expect(res.body.error).toEqual(`Expected format: {
        project: <String>
        }. You are missing a "project" property.`);
      });

    it('should return status 422 and a message "No project with that id found"', async () => {
      const replacementProject = { project: 'NewName' };
      const id = 100000000;
      const res = await request(app).patch(`/projects/${id}`).send(replacementProject);

      expect(res.status).toBe(422)
      expect(res.body.error).toEqual(`Did not find any projects with that id.`);
    });
  });

  describe('PATCH /palettes/:id', () => {
    it('should update an existing palette\'s information', async () => {
      const paletteToReplace = await database('palettes').where('project_name', 'Project_One').first();
      const replacementPalette = { 
        palette: 'NewName', 
        hex_1: '#C70039',
        hex_2: '#C70039', 
        hex_3: '#C70039', 
        hex_4: '#C70039', 
        hex_5: '#C70039', 
        project_name: 'Project_One'};
      const id = paletteToReplace.id;
      const res = await request(app).patch(`/palettes/${id}`).send(replacementPalette);
      
      expect(res.status).toBe(201)
      expect(res.body).toEqual(`Palette with id ${id} has been successfully updated.`);
    });

    it('should return status 422 and a message "Missing property"', async () => {
     const replacementPalette = {
        palette: 'NewName',
        hex_1: '#C70039',
        hex_2: '#C70039',
        hex_3: '#C70039',
        hex_4: '#C70039',
        project_name: 'Project_One'
      };
      const paletteToReplace = await database('palettes').first();
      const id = paletteToReplace.id;
      const res = await request(app).patch(`/palettes/${id}`).send(replacementPalette);

      expect(res.status).toBe(422)
      expect(res.body.error).toEqual(`Expected format: {
          palette: <String>,
          hex_1: <String>,
          hex_2: <String>,
          hex_3: <String>,
          hex_4: <String>,
          hex_5: <String>,
          project_name: <String>
        }. You are missing a "hex_5" property.`);
    });

    it('should return status 422 and a message "No project with that id found"', async () => {
      const replacementPalette = {
        palette: 'NewName',
        hex_1: '#C70039',
        hex_2: '#C70039',
        hex_3: '#C70039',
        hex_4: '#C70039',
        hex_5: '#C70039',
        project_name: 'Project_One'
      };
      const id = 100000000;
      const res = await request(app).patch(`/palettes/${id}`).send(replacementPalette);

      expect(res.status).toBe(422)
      expect(res.body.error).toEqual(`Did not find any palettes with that id.`);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should remove a project and all associated palettes', async () => {
      const project = await database('projects').first();
      const id = project.id;

      const res = await request(app).delete(`/projects/${id}`);

      expect(res.status).toBe(204);
    });

    it('should return an error message if there is no project to delete', async () => {
      const id = 10000000;
      const res = await request(app).delete(`/projects/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual(`No project with id ${id}`);
    });
  });

  describe(' DELETE /palettes/:id', () => {
    it('should remove a palette', async () => {
      const palette = await database('palettes').first();
      const id = palette.id;

      const res = await request(app).delete(`/palettes/${id}`);

      expect(res.status).toBe(204);
    });

    it('should return an error message if there is no palette to delete', async () => {
      const id = 10000000;
      const res = await request(app).delete(`/palettes/${id}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual(`No palette with id ${id}`);
    });
  });

  describe('GET /palettes?hex_code=', () => {
    it('should return a palette containing the hex code along with the associated project', async () => {
      
    });
  });
});