exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('palette');
      table.string('hex_1');
      table.string('hex_2');
      table.string('hex_3');
      table.string('hex_4');
      table.string('hex_5');
      table.integer('project_id').unsigned();
      table.foreign('project_id')
        .references('projects.id');
      
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};
