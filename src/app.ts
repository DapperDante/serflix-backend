import express, { Application } from "express";
import routerMovie from "./routes/movie/movie.router";
import dotenv from "dotenv";
import routerSerie from "./routes/serie/serie.router";
import db from "./db/connection";
import cors from "cors";
import routerUser from "./routes/user/user.router";
import routerProfile from "./routes/profile/profile.router";
import routerReview from "./routes/score/score.router";
import routerSearch from "./routes/search/search.router";
import { AuthenticationUser, AuthenticationProfile } from "./middleware/authentication.middleware";
dotenv.config();
class Server {
	private app: Application;
	private port: string;
	constructor() {
		this.app = express();
		this.port = process.env.LOCAL_PORT!;
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
		this.app.use("/api/user", routerUser);
		this.app.use("/api/profile", routerProfile);
		this.app.use("/api/movie", routerMovie);
		this.app.use("/api/serie", routerSerie);
		this.app.use("/api/score", routerReview);
		this.app.use("/api/search", routerSearch);
	}
	middleware() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(AuthenticationUser);
		this.app.use(AuthenticationProfile);
	}
	async database() {
		try {
			await db.authenticate();
			console.log("connect to Database");
		} catch (err) {
			console.error("can't connect to Database");
		}
	}
}
new Server();
