import '@tensorflow/tfjs-node';
import * as encoder from "@tensorflow-models/universal-sentence-encoder";
import express from "express";
import routerMovie from "./routes/movie/movie.router";
import routerSerie from "./routes/serie/serie.router";
import db from "./db/connection";
import cors from "cors";
import routerUser from "./routes/user/user.router";
import routerProfile from "./routes/profile/profile.router";
import routerReview from "./routes/score/score.router";
import routerSearch from "./routes/search/search.router";
import routerRecommendation from "./routes/recommendation/recommendation.router";
import helmet from "helmet";
import compression from "compression";
import { ENV_SETUP } from "./config/variables.config";
import { isValidToken, tokenProfile } from "./middleware/token.middleware";
import { errorHandling } from "./middleware/error.middleware";
import { UniversalSentenceEncoderQnA } from "@tensorflow-models/universal-sentence-encoder/dist/use_qna";
import routerLayout from './routes/layout/layout.router';

const app = express();
let modelIA: UniversalSentenceEncoderQnA | null = null;

class Server {
	constructor() {
		if(ENV_SETUP.NODE_ENV?.includes("development") || ENV_SETUP.NODE_ENV?.includes("production"))
			this.listen();
		this.loadIA();
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
		app.use("/api/layout", routerLayout);
		app.use(errorHandling);
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
		app.use(isValidToken);
		app.use(tokenProfile);
	}
	async database() {
		try {
			await db.authenticate();
			console.log("Connect to Database");
		} catch (err) {
			console.error("Can't connect to Database");
		}
	}
	async loadIA(){
		modelIA = await encoder.loadQnA();
		console.log("Model IA loaded");
	}
}
new Server();
export default { app, modelIA }; 