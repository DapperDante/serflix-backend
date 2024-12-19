import express, {Application} from "express";
import routerMovie from "./routes/movie/movie.router";
import dotenv from 'dotenv';
import routerSerie from "./routes/serie/serie.router";
import db from './db/connection';
import cors from 'cors';
import routerUser from "./routes/user/user.router";
import routerProfile from "./routes/profile/profile.router";
import routerReview from "./routes/movie/score_movies.router";
import routerSearch from "./routes/search/search.router";
class Server {
    private app: Application;
    private port: string;
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3004';
        this.listen();
        this.middleware();
        this.routes();
        this.database();
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Project on the port ${this.port}`);
        })
    }
    routes(){
        this.app.use('/api/favorite-movie', routerMovie);
        this.app.use('/api/favorite-serie', routerSerie);
        this.app.use('/api/user', routerUser);
        this.app.use('/api/profile', routerProfile);
        this.app.use('/api/score-movie', routerReview);
        this.app.use('/api/search', routerSearch);
    }
    middleware(){
        this.app.use(cors());
        this.app.use(express.json());
    }
    async database(){
        try{
            await db.authenticate();
            console.log('conecto to Database')
        }catch(err){
            console.log(err);
            console.log("can't connect to Database");
            
        }
    }
}
dotenv.config();
const server = new Server();