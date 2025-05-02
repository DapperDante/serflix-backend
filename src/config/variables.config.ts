import { configDotenv } from "dotenv";

configDotenv();

export const ENV_SETUP = {
	NODE_ENV: process.env.NODE_ENV,
	PORT : Number(process.env.DOCKER_PORT ? process.env.DOCKER_PORT : process.env.PORT) || 3000,
	DB_NAME : process.env.DB_NAME,
	DB_USER : process.env.DB_USER,
	DB_PASSWORD : process.env.DB_PASSWORD,
	DB_HOST : process.env.DB_HOST,
	DB_PORT : process.env.DB_DOCKER_PORT ? process.env.DB_DOCKER_PORT : process.env.DB_LOCAL_PORT,
	API_TMDB: process.env.API_TMDB,
	TOKEN_TMDB: process.env.TOKEN_TMDB,
	CLAVE_ENCRYPTATION: process.env.CLAVE_ENCRYPTATION,
	SECRET_KEY_TOKEN : process.env.SECRET_KEY_TOKEN,
	EMAIL: process.env.EMAIL,
	PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
	API_SERFLIX: process.env.API_SERFLIX
}