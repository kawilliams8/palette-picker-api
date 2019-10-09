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

})