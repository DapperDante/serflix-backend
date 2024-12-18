"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3004';
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
        this.app.use('/api/favorite-movie', movie_router_1.default);
        this.app.use('/api/favorite-serie', serie_router_1.default);
        this.app.use('/api/user', user_router_1.default);
        this.app.use('/api/profile', profile_router_1.default);
        this.app.use('/api/score-movie', score_movies_router_1.default);
    }
    middleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    database() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('conecto to Database');
            }
            catch (err) {
                console.log(err);
                console.log("can't connect to Database");
            }
        });
    }
}
dotenv_1.default.config();
const server = new Server();
