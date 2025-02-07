import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
import Profiles from "./profiles.model";
import Goals from "./goals.model";

const ProfileGoals = sequelize.define(
	"profile_goals",
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		profile_id: {
			type: DataTypes.NUMBER,
			references: {
				model: Profiles,
				key: "id",
			},
			allowNull: false,
		},
		goal_id: {
			type: DataTypes.NUMBER,
			references: {
				model: Goals,
				key: "id",
			},
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);
export default ProfileGoals;
