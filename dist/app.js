"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_router_1 = __importDefault(require("./routes/movie/movie.router"));
const dotenv_1 = __importDefault(require("dotenv"));
const serie_router_1 = __importDefault(require("./routes/serie/serie.router"));
const connection_1 = __importDefault(require("./db/connection"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./routes/user/user.router"));
const profile_router_1 = __importDefault(require("./routes/profile/profile.router"));
const score_movies_router_1 = __importDefault(require("./routes/movie/score_movies.router"));
const search_router_1 = __importDefault(require("./routes/search/search.router"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.LOCAL_PORT;
        this.listen();
        this.middleware();
        this.routes();
        this.database();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Project on the port ${this.port}`);
        });
    }
    routes() {
        this.app.use('/api/movie', movie_router_1.default);
        this.app.use('/api/serie', serie_router_1.default);
        this.app.use('/api/user', user_router_1.default);
        this.app.use('/api/profile', profile_router_1.default);
        this.app.use('/api/score', score_movies_router_1.default);
        this.app.use('/api/search', search_router_1.default);
    }
    middleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    async database() {
        try {
            await connection_1.default.authenticate();
            console.log('connect to Database');
        }
        catch (err) {
            console.log(err);
            console.log("can't connect to Database");
        }
    }
}
new Server();
