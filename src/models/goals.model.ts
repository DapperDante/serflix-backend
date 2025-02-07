import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

const Goals = sequelize.define('goals', {
		id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
		},
		name: {
				type: DataTypes.TEXT,
				allowNull: false
		},
		detail: {
				type: DataTypes.TEXT,
				allowNull: false
		},
		url: {
				type: DataTypes.TEXT,
				allowNull: false
		}
}, {
		createdAt: false,
		updatedAt: false	
});
export default Goals;