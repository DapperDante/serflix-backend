import { DataTypes } from "sequelize";
import db from '../db/connection';
import Users from "./users.model";
const Profiles = db.define('profiles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: 'id'
        },
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})
export default Profiles;