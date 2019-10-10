const app = require("./app");

app.locals.title = 'Palette Picker API'

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on localhost: ${app.get('port')}.`);
});

app.get("/", (request, response) => {
  response.send("This is Palette Picker!");
});

module.exports = app; 