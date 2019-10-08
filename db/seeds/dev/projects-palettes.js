const projects =  require('../../../test-data');
const palettes = require('../../../test-data');

const createProject = (knex, project) => {
  return knex('projects').insert({
    project: project.project
  })
}

const createPalette = (knex, palette) => {
  return knex('projects').where('project', palette.project_name).first()
    .then(project => {
      return knex('palettes').insert({
        palette: palette.palette,
        hex_1: palette.hex_1,
        hex_2: palette.hex_2,
        hex_3: palette.hex_3,
        hex_4: palette.hex_4,
        hex_5: palette.hex_5,
        project_name: palette.project_name,
        project_id: project.id
      })
    })
}

exports.seed = function(knex) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];
      projects.projects.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });
      return Promise.all(projectPromises);
    })
    .then(() => {
      let palettePromises = [];
      palettes.palettes.forEach(palette => {
        palettePromises.push(createPalette(knex, palette));
      });
      return Promise.all(palettePromises)
    })
    .catch(err => console.log(`Error seeding data: ${err}`))
};
