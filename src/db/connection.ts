import { Sequelize } from "sequelize";
const sequelize = new Sequelize('serflix', 'root', 'Dppdnt26', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3307
})
export default sequelize;