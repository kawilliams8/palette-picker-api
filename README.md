# Color Schema

This project is...

This repository will serve as your "backend", allowing you to connect to a persistent PostgreSQL database...

Deployed to Heroku at...

## Project Setup

* Clone down the repo and run `npm install`
* Run the migration and seed files to create a new local database
* If you don't have postgresSQl, install it to directly query the database tables with postgres and sql commands.
* Run `npm start` and navigate your browser to `localhost:3001/`. You should see a confirmation message that the server is running.

## API - Endpoints

Data in the production database can be accessed using the fetch API. If you are making a post request, note that you will need to pass in an options object with a method and headers - with a `'Content-Type': 'application/json'`. Additionally you will need to pass any any required fields into the body.

### GET all Projects or Palettes

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Fetch all projects |`/api/v1/projects`| GET | N/A |
| Fetch all palettes |`/api/v1/palettes`| GET | N/A |

A successful response:



### GET one Project or Palette

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Fetch one project |`/api/v1/projects/:id`| GET | N/A |
| Fetch one palette |`/api/v1/palettes/:id`| GET | N/A |

The `:id` should be replaced with the integer `id` of a Project or Palette.

A successful response:



### POST new Project or Palette

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Add a project |`/api/v1/projects`| POST | N/A |
| Add a palette |`/api/v1/palettes`| POST | N/A |

The body of the POST request should be formatted as such:

* `project` requires: `movie_id (Integer), title (String), poster_path (String), release_date (String), vote_average (String), overview (String)`
* `palette` requires: `book_id (Integer), author_name (String), book_name VARCHAR (String), artwork_url (String), release_date (String), description (String), primary_genre_name (String)`

A successful response:



### PATCH updated Project or Palette

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Edit a project |`/api/v1/projects/:id`| PATCH | N/A |
| Edit a palette |`/api/v1/palettes/:id`| PATCH | N/A |

The `:id` should be replaced with the integer `id` of a Project or Palette.

The body of a PATCH request should be formatted as such:

* `project` requires: `movie_id (Integer), title (String), poster_path (String), release_date (String), vote_average (String), overview (String)`
* `palette` requires: `book_id (Integer), author_name (String), book_name VARCHAR (String), artwork_url (String), release_date (String), description (String), primary_genre_name (String)`

A successful response:



### DELETE a Project or Palette

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Remove a project |`/api/v1/projects/:id`| DELETE | N/A |
| Remove a palette |`/api/v1/palettes/:id`| DELETE | N/A |

The `:id` should be replaced with the integer `id` of a Project or Palette.

A successful response:



### QUERY existing Palettes by hex code

| Purpose | URL | Verb | Request Body |
|----|----|----|----|
| Search by hex |`/api/v1/palettes?hex=FFFFFF`| GET | N/A |

The `FFFFFF` should be replaced with the six-character hex code you wish to query.

A successful response:

