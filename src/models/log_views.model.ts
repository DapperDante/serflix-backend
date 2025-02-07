import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
import Profiles from "./profiles.model";

const LogViews = sequelize.define(
	"log_views",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		profile_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Profiles,
				key: "id",
			},
			allowNull: false,
		},
		item_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		type: {
			type: DataTypes.CHAR,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);
export default LogViews;
