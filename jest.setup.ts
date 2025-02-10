import app from "./src/app";
import { ENV_SETUP } from "./src/config/variables-env";
import sequelize from "./src/db/connection";

let server: any;

beforeAll(async () => {
	server = app.listen(ENV_SETUP.PORT, ()=>{
		console.log(`Server running on port ${ENV_SETUP.PORT}`);
	});
	await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
	await sequelize.truncate({ cascade: true });
	await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
});

afterAll(async () => {
	await sequelize.close();
	server.close();
});