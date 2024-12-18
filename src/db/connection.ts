import { Sequelize } from "sequelize";
const sequelize = new Sequelize('serflix', 'root', 'Dppdnt26', {
    host: 'localhost',
    dialect: 'mysql'
})
export default sequelize;