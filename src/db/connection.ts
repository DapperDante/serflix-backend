import { Sequelize } from "sequelize";
import { ENV_SETUP } from "../config/variables.config";
const fs = require("fs");
const sequelize = new Sequelize(
	ENV_SETUP.DB_NAME!,
	ENV_SETUP.DB_USER!,
	ENV_SETUP.DB_PASSWORD,
	{
		host: ENV_SETUP.DB_HOST,
		dialect: "mysql",
		dialectOptions: {
			ssl: {
				ca: fs.readFileSync(ENV_SETUP.DB_NAME_FILE_SSL_CA)
			}
		},
		port: Number(ENV_SETUP.DB_PORT),
		logging: ENV_SETUP.NODE_ENV === "development" ? true : false,
	}
);
export default sequelize;
