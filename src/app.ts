import express from "express";
import routerMovie from "./routes/movie/movie.router";
import routerSerie from "./routes/serie/serie.router";
import db from "./db/connection";
import cors from "cors";
import routerUser from "./routes/user/user.router";
import routerProfile from "./routes/profile/profile.router";
import routerReview from "./routes/score/score.router";
import routerSearch from "./routes/search/search.router";
import {
	AuthenticationUser,
	AuthenticationProfile,
} from "./middleware/authentication.middleware";
import routerRecommendation from "./routes/recommendation/recommendation.router";
import helmet from "helmet";
import compression from "compression";
import { ENV_SETUP } from "./config/variables-env";

const app = express();

class Server {
	constructor() {
		if (!ENV_SETUP.NODE_ENV?.includes("testing")) this.listen();
		this.middleware();
		this.routes();
		this.database();
	}
	routes() {
		app.use("/api/user", routerUser);
		app.use("/api/profile", routerProfile);
		app.use("/api/movie", routerMovie);
		app.use("/api/recommendation", routerRecommendation);
		app.use("/api/serie", routerSerie);
		app.use("/api/score", routerReview);
		app.use("/api/search", routerSearch);
	}
	listen() {
		app.listen(ENV_SETUP.PORT, () => {
			console.log(`Server running on port ${ENV_SETUP.PORT}`);
		});
	}
	middleware() {
		app.use(cors());
		app.use(express.json());
		app.use(helmet());
		app.use(compression());
		app.use(AuthenticationUser);
		app.use(AuthenticationProfile);
	}
	async database() {
		try {
			await db.authenticate();
			console.log("Connect to Database");
		} catch (err) {
			console.error("Can't connect to Database");
		}
	}
}
new Server();
export default app;
