# Server-Serflix

This service is focus about manage control of accounts and profiles, There are many APIs to do request for diferent case, but each of them has structure and similarity than others APIs like `/api/movies/get` and `/api/series/get` both APIs have same structure but
there are some diference about the response

## Diagram database

![Diagram of database](/src/assets/diagramDB.png)

## API

All request have prefix `/api/` and its parameters has format camelCase, the next table you can see the options about each Api:

| Name               | Options                                             | Body                        | Response                                |
| ------------------ | --------------------------------------------------- | --------------------------- | --------------------------------------- |
| `/user`            | `/register`                                         | `username, email, password` | `msg, token`                            |
|                    | `/login`                                            | `username, password`        | `msg, token`                            |
| `/profile`         | `/add`                                              | `idUser, name, img`         | `msg, token`                            |
|                    | `/get-all`                                          | `none`                      | `results[...]`                          |
|                    | `/log-in`                                           | `idProfile`                 | `msg, token`                            |
|                    | `/get`                                              | `none`                      | `name, img, results[...], goals[...]`   |
|                    | `/put`                                              | `name, img`                 | `msg`                                   |
| `/recommendations` | `get`                                               | `none`                      | `results`                               |
|                    | `get-profile`                                       | `none`                      | `last_viewed, recommendations`          |
| `/movie`           | `/add`                                              | `idMovie`                   | `msg, goal`                             |
|                    | `/get`                                              | `none`                      | `results[...]`                          |
|                    | `/get/:idMovie`                                     | `none`                      | `result, is_favorite`                   |
|                    | `/delete/:idMovie`                                  | `none`                      | `msg`                                   |
| `/serie`           | `/add`                                              | `idSerie`                   | `msg, goal`                             |
|                    | `/get`                                              | `none`                      | `results[...]`                          |
|                    | `/get/:idSerie`                                     | `none`                      | `result, is_favorite`                   |
|                    | `/delete/:idSerie`                                  | `none`                      | `msg`                                   |
| `/score`           | `/movie/add`                                        | `idMovie, score, review`    | `msg`                                   |
|                    | `/movie/get/:idMovie`                               | `none`                      | `review, avg_score, results[...]`       |
|                    | `/serie/add`                                        | `idSerie, score, review`    | `msg`                                   |
|                    | `/serie/get/:idSerie`                               | `none`                      | `review, avg_score, results[...]`       |
| `/search`          | `?query=text&times=number&manyItemsRelation=number` | `none`                      | `total_pages, total_results, results[]` |

When you request of search you must add queries for IA (tensorflow/tfjs-node and universal-sentence-encoder) can work to research on the data's database:
**where**:

- **query:** only can string, this query reference about movie's description or title
- **times:** it's a number of data's area to research, if you want big area to get more presition,
  you could put high number but your request could be slow
- **manyItemsRelation:**: number of how to many item returned after research but there movies will have similar movies added each of them

## Development

When you get up this server in development you only introduced in your terminal `npm run dev`
because that command active `tsc --watch` (translate from ts to js) and `npx nodemon`, that command was base on dependency's concurrently.
(When you ruuning with this mode is neccesary first install all dependencies but the best way is on Docker).

Now this project be able to up on docker with the command `docker compose up` but if you have problem and change other line of code and you update change, you only put `docker compose up --build` because rebuild and compile changes

## Handling error

To avoid repeat many lines of code and get different results, so there is a file to avoid that and you can found and fix that problem and get better that control

## Environment variables

For this project have to have many environment variables to functionaly, to add those variables you must add new file with extension `.env` on root project and have the following:

> If you don't work on docker, discard the docker's variables

##### NODE_ENV

This is most important because asign rol, the only values are 'development', 'testing' and 'production'

##### PORT

This variables is you can communicate to the backend, you could put `3000` or any value

##### DOCKER_PORT

If you work on docker in this project you must put one port where other client can communicate to node

##### TOKEN_TMDB

It must need to put one token by TMDB because some methods need to get other informaton by that service

##### API_TMDB

This is just for organizing some line of code, for example `https://api.themoviedb.org/3` that url is base of API

##### DB_HOST

This part is essential to connect your database, if you work on docker you don't put this environment variable.

##### DB_USER

if you want put other name of user than root, but most common is `root`

##### DB_PASSWORD

It's essential put your password of your database, if you work on docker this password is now your password of your new database

##### DB_NAME

you could put any name like `serflix_db` or `my_new_database`, but its name will where store all information

##### DB_LOCAL_PORT

here is where put your port where the database is host, but if you work on docker you could any number

##### DB_DOCKER_PORT

When you work on docker is must be neccesary put one number because is where you can communicate with a client like DBeaver or workbench

##### CLAVE_ENCRYPTATION

It's to encrypte the passwords with system AES

##### SECRET_KEY_TOKEN

It's to transform data of user with JWS

### Common problems
 
If you have problem like `Not found backend` (don't care), To resolve this problem you navigate to node_modules where it's @tensorflow\tfjs-node\lib\napi-v9 and move tensorflow.dll from this directory to ../napi-v8, finally reset your backend.
