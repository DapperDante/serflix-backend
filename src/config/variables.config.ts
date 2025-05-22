import { configDotenv } from "dotenv";

configDotenv();

export const ENV_SETUP = {
	NODE_ENV: process.env.NODE_ENV!,
	PORT : Number(process.env.DOCKER_PORT ? process.env.DOCKER_PORT : process.env.PORT) || 3000,
	DB_NAME : process.env.DB_NAME!,
	DB_USER : process.env.DB_USER!,
	USE_SSL: process.env.USE_SSL!,
	DB_NAME_FILE_SSL_CA: process.env.DB_NAME_FILE_SSL_CA!,
	DB_PASSWORD : process.env.DB_PASSWORD!,
	DB_HOST : process.env.DB_HOST!,
	DB_PORT : Number(process.env.DB_DOCKER_PORT ? process.env.DB_DOCKER_PORT : process.env.DB_LOCAL_PORT) || 3306,
	API_TMDB: process.env.API_TMDB!,
	TOKEN_TMDB: process.env.TOKEN_TMDB!,
	CLAVE_ENCRYPTATION: process.env.CLAVE_ENCRYPTATION!,
	SECRET_KEY_TOKEN : process.env.SECRET_KEY_TOKEN!,
	EMAIL: process.env.EMAIL!,
	PASSWORD_EMAIL: process.env.PASSWORD_EMAIL!,
	API_SERFLIX: process.env.API_SERFLIX!,
	CORS_ORIGINS: process.env.CORS_ORIGINS
}