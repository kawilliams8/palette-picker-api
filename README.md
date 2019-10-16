# Color Schema

Color Schema is a color palette picking tool built for web developers. It is a paired project built during Mod 4 of the Front End Engineering program at the Turing School of Software and Design.

Color Schema challenges front end students to build and deploy development, testing and production environments for a one-to-many relational database with two tables. Eleven endpoints serve up data to a [React web app](https://palette-picker-dg.herokuapp.com) built by the same team.

This project includes a production environment, deployed to [Heroku](https://palette-picker-api-williams.herokuapp.com).

Color Schema was built with Node.js, Express, Knex, PostgreSQL, Postman, Travis CI and Heroku.

## Authors

[David Gitlen](https://github.com/davidagitlen)
[Katherine Williams](https://github.com/kawilliams8)

## Database Design

![Database Schema](https://github.com/kawilliams8/palette-picker-api/images/db_schema.png)

## Project Setup

- Clone down the repo and run `npm install`
- Run the migration and seed files to create a new local database
- If you don't have postgresSQl, install it to directly query the database tables with postgres and sql commands.
- Run `npm start` and navigate your browser to `localhost:3001/`. You should see a confirmation message that the server is running.

## API - Endpoints

Data in the production database can be accessed using the fetch API via Postman, a browser or other similar tools. When making POST/PATCH requests, note that you will need to pass in an options object with a method and headers with `'Content-Type': 'application/json'`. Further information on any required fields can be found below.

### GET all Projects or Palettes

| Purpose            | URL                | Verb | Request Body |
| ------------------ | ------------------ | ---- | ------------ |
| Fetch all projects | `/api/v1/projects` | GET  | N/A          |
| Fetch all palettes | `/api/v1/palettes` | GET  | N/A          |

A successful response is an array of objects:

```
[
  {
    "id": 1,
    "project": "Project_One",
    "created_at": "2019-10-08T22:34:28.064Z",
    "updated_at": "2019-10-08T22:34:28.064Z"
  }
]
```

```
[
  {
    "id": 1,
    "palette": "Palette_Two",
    "hex_1": "#534B62",
    "hex_2": "#A499B3",
    "hex_3": "#D0BCD5",
    "hex_4": "#226CEO",
    "hex_5": "#1B1725",
    "project_id": 1,
    "created_at": "2019-10-08T22:34:28.079Z",
    "updated_at": "2019-10-08T22:34:28.079Z",
    "project_name": "Project_One"
  }
]
```

A failed GET will return a semantic message as a string.

### GET one Project or Palette

| Purpose           | URL                    | Verb | Request Body |
| ----------------- | ---------------------- | ---- | ------------ |
| Fetch one project | `/api/v1/projects/:id` | GET  | N/A          |
| Fetch one palette | `/api/v1/palettes/:id` | GET  | N/A          |

The `:id` should be replaced with the integer `id` of a Project or Palette.

A successful response contains one object:

```
{
  "id": 1,
  "project": "Project_One",
  "created_at": "2019-10-08T22:34:28.064Z",
  "updated_at": "2019-10-08T22:34:28.064Z"
}
```

```
  {
    "id": 1,
    "palette": "Palette_Two",
    "hex_1": "#534B62",
    "hex_2": "#A499B3",
    "hex_3": "#D0BCD5",
    "hex_4": "#226CEO",
    "hex_5": "#1B1725",
    "project_id": 1,
    "created_at": "2019-10-08T22:34:28.079Z",
    "updated_at": "2019-10-08T22:34:28.079Z",
    "project_name": "Project_One"
  }
```

A failed GET of a resource will return a semantic message as a string.

### POST new Project or Palette

| Purpose       | URL                | Verb | Request Body |
| ------------- | ------------------ | ---- | ------------ |
| Add a project | `/api/v1/projects` | POST | *See below  |
| Add a palette | `/api/v1/palettes` | POST | *See below  |

The body of the POST request should be formatted as such:

- `project` requires: `project (String)`
- `palette` requires: `palette (String), hex_1 (String), hex_2 (String), hex_3 (String), hex_4 (String), hex_5 (String), project_id (Number), project_name (String)`

A successful response contains the id number for the new Project or Palette.

```
{
  "id": 10
}
```

```
{
  "id": 11
}
```

A failed POST of a resource will return a semantic message as a string, and notify if any required parameters were missing.

### PATCH updated Project or Palette

| Purpose        | URL                    | Verb  | Request Body |
| -------------- | ---------------------- | ----- | ------------ |
| Edit a project | `/api/v1/projects/:id` | PATCH | *See below |
| Edit a palette | `/api/v1/palettes/:id` | PATCH | *See below |

The `:id` should be replaced with the integer `id` of a Project or Palette.

The body of a PATCH request should be formatted as such:

- `project` requires: `project (String)`
- `palette` requires: `palette (String), hex_1 (String), hex_2 (String), hex_3 (String), hex_4 (String), hex_5 (String), project_id (Number), project_name (String)`

A successful response contains the id number for the new Project or Palette.

```
{
  "id": 10
}
```

```
{
  "id": 11
}
```

A failed PATCH of a resource will return a semantic message as a string, and notify if any required parameters were missing.

### DELETE a Project or Palette

| Purpose          | URL                    | Verb   | Request Body |
| ---------------- | ---------------------- | ------ | ------------ |
| Remove a project | `/api/v1/projects/:id` | DELETE | N/A          |
| Remove a palette | `/api/v1/palettes/:id` | DELETE | N/A          |

The `:id` should be replaced with the integer `id` of a Project or Palette.

A successful DELETE will not return a response. A failed DELETE will return a message as a string.

### QUERY existing Palettes by hex code

| Purpose       | URL                           | Verb | Request Body |
| ------------- | ----------------------------- | ---- | ------------ |
| Search Palettes | `/api/v1/palettes?hex=FFFFFF` | GET  | N/A          |

The `FFFFFF` in the URL should be replaced with the six-character hex code you wish to query.

A successful response is an array of matching palette objects:

```
[
  {
    "id": 1,
    "palette": "Palette_Two",
    "hex_1": "#FFFFFF",
    "hex_2": "#A499B3",
    "hex_3": "#D0BCD5",
    "hex_4": "#226CEO",
    "hex_5": "#1B1725",
    "project_id": 1,
    "created_at": "2019-10-08T22:34:28.079Z",
    "updated_at": "2019-10-08T22:34:28.079Z",
    "project_name": "Project_One"
  }
]
```
A failed query of resources by hex code will return a semantic message as a string.
