
exports.up = function(knex) {
  return knex.schema.table('palettes', function(table) {
    table.string('project_name')
  })
};

exports.down = function(knex) {
  return knex.schema.table('palettes', function(table) {
    table.dropColumn('project_name')
  })
};
