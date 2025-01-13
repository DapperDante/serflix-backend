import { DataTypes } from "sequelize";
import db from '../db/connection';
const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        unique: true,
		allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false,
});
export default Users;