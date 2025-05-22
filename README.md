# Server-Serflix

It's focused on user and profile management and response movies or series of **TDMB**, also it has **Tensorflow** as search through **universal-sentence-encoder**'s model, moreover it has **nodemailer** to send messages, such as welcome, forgot-password, authenticate a user or reset a password.

## Diagram database

![Diagram of database](/src/assets/diagramDB.png)

## Security levels in tokens

Most request need a token's role to access, moreover it's useful when a profile can't do something for user, on other hand each endpoint could have a token's role depend on the context and porpuse, like that:

| Number | Role              |
| ------ | ----------------- |
| 0      | Public access     |
| 1      | Account access    |
| 2      | Profile access    |
| 3      | Authenticate user |
| 4      | Forgot password   |

## API

All request have prefix `/api/` and its parameters has format camelCase, the next table you can see the options about each Api:

| Name              | HTTP     | Role | Option                       | Payload                     | Response                                |
| ----------------- | -------- | ---- | ---------------------------- | --------------------------- | --------------------------------------- |
| `/user`           | `POST`   | 0    | `/register`                  | `username, email, password` | `msg, token`                            |
|                   | `POST`   | 0    | `/login`                     | `username, password`        | `msg, token`                            |
|                   | `PUT`    | 0    | `/request/forgot-password`   | `email`                     | `msg`                                   |
|                   | `PUT`    | 4    | `/forgot-password`           | `newPassword`               | `msg`                                   |
|                   | `PUT`    | 3    | `/auth`                      | `none`                      | `msg`                                   |
|                   | `PUT`    | 1,2  | `/password`                  | `oldPassword, newPassword`  | `msg`                                   |
|                   | `PUT`    | 1    | `/username`                  | `newUsername`               | `msg`                                   |
|                   | `PUT`    | 1    | `/premium`                   | `none`                      | `msg`                                   |
|                   | `PUT`    | 1    | `/free`                      | `none`                      | `msg`                                   |
| `/profile`        | `POST`   | 1    | `/`                          | `idUser, name, img`         | `msg, token`                            |
|                   | `GET`    | 2    | `/`                          | `none`                      | `results[...]`                          |
|                   | `PUT`    | 2    | `/`                          | `idProfile`                 | `msg, token`                            |
|                   | `POST`   | 1    | `/login`                     | `none`                      | `name, img, results[...], goals[...]`   |
|                   | `POST`   | 2    | `/logout`                    | `name, img`                 | `msg`                                   |
|                   | `POST`   | 2    | `/password`                  | `name, img`                 | `msg`                                   |
|                   | `PUT`    | 2    | `/password`                  | `name, img`                 | `msg`                                   |
|                   | `DELETE` | 2    | `/password`                  | `name, img`                 | `msg`                                   |
|                   | `GET`    | 1    | `/all`                       | `name, img`                 | `msg`                                   |
| `/recommendation` | `GET`    | 2    | `/`                          | `none`                      | `results`                               |
|                   | `GET`    | 2    | `/all`                       | `none`                      | `last_viewed, recommendations`          |
| `/movie`          | `POST`   | 2    | `/`                          | `idMovie`                   | `msg, goal`                             |
|                   | `GET`    | 2    | `/`                          | `none`                      | `results[...]`                          |
|                   | `GET`    | 2    | `/:id`                       | `none`                      | `result, is_favorite`                   |
|                   | `DELETE` | 2    | `/:id`                       | `none`                      | `msg`                                   |
| `/serie`          | `POST`   | 2    | `/`                          | `idSerie`                   | `msg, goal`                             |
|                   | `GET`    | 2    | `/`                          | `none`                      | `results[...]`                          |
|                   | `GET`    | 2    | `/:id`                       | `none`                      | `result, is_favorite`                   |
|                   | `DELETE` | 2    | `/:id`                       | `none`                      | `msg`                                   |
| `/score`          | `POST`   | 2    | `/movie/`                    | `idMovie, score, review`    | `msg`                                   |
|                   | `GET`    | 2    | `/movie/:id`                 | `none`                      | `its_score, avg_score, scores[...]`     |
|                   | `POST`   | 2    | `/serie/`                    | `idSerie, score, review`    | `msg`                                   |
|                   | `GET`    | 2    | `/serie/:id`                 | `none`                      | `its_score, avg_score, scores[...]`     |
| `/search`         | `GET`    | 2    | `?query&times&itemsRelation` | `none`                      | `total_pages, total_results, results[]` |

When you make a request of search you must add queries for IA (tensorflow/tfjs-node and universal-sentence-encoder) can work to research on the data of database:

**Where**:
- **query:** only can string, this query reference about movie's description or title
- **times:** it's a number of data's area to research, if you want big area to get more presition,
  you could put high number but your request could be slow
- **itemsRelation:**: number of how to many item returned after research but there movies will have similar movies added each of them

## Run 

When you get up this server in development mode you just introduced in your terminal `npm run dev` but if you want to get up in production you just intruduced `npm start` where just uses node to get up it without any script by ts.

Now, this project is able to up on docker with the command `docker compose up` but if you have problem and change other line of code and you update change, you only put `docker compose up --build` for rebuild and compile changes

## Email system

Now, it's able to send emails through **nodemailer**.

When you add a new user, automatic it sends an email to give welcome for user but if you want other templates for each method that required, you add a new folder on email's templates and add a `index.html` into it, also you can add a `style.css`.

## Handling error

To avoid repeat many code's line and get different results, there's a middleware to centralizes the errors, moreover most errors has a kind of error such as `PermissionDeniedError`.

## Variable's environment

For this project have to have many variable's environment to functionaly, to add those variables you must add new file with extension `.env` on root project and has the following variables:

> If you don't work on docker, discard the docker's variables

##### NODE_ENV

This is the most important because asign role for the server, the only values are 'development', 'testing' and 'production'.

##### PORT

This variables is you can communicate to the backend, you could put `3000` or any value.

##### DOCKER_PORT

If you work on docker in this project you must put one port where other client can communicate to node.

##### TOKEN_TMDB

It must need to put a TMDB's token because some methods need to get some informaton by that service.

##### API_TMDB

This is just for organizing some line of code, for example `https://api.themoviedb.org/3` that url is base of TMDB's API.

##### DB_HOST

This part is essential to connect your database, if you work on docker you don't put this variable.

##### DB_USER

It's name of user who connected for database.

##### USE_SSL

It's a boolean's state to use ssl or not, because on production it's better use ssl for database.

##### DB_NAME_FILE_SSL_CA

File's name of ssl to open it on connection to database.

##### DB_PASSWORD

It's essential put your password of your database, if you work on docker this password is now your password of your new database.

##### DB_NAME

You could put any name like `serflix_db` or `my_new_database`, but its name will where store all information.

##### DB_LOCAL_PORT

It's just database's port and it's commonly use 3306, but if you work on docker you could any number.

##### DB_DOCKER_PORT

When you work on docker is must be neccesary put one number because is where you can communicate with a client like DBeaver or workbench.

##### CLAVE_ENCRYPTATION

It's for encrypte the passwords with system AES.

##### SECRET_KEY_TOKEN

It's for JWS that is token's role.

##### EMAIL

it's to authenticate of service to send emails through nodemailer.

##### PASSWORD_EMAIL

it's to password of service that use nodemailer to authenticate.

##### API_SERFLIX

it's just reference in certain code's line, also it's important for email's controllers.

### Common problems

If you have problem like `Not found backend` (don't care), To resolve this problem you navigate to node_modules where it's @tensorflow\tfjs-node\lib\napi-v9 and move tensorflow.dll from this directory to ../napi-v8, finally reset your backend.
