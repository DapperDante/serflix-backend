import { DataTypes } from "sequelize";
import db from "../db/connection";
import Profiles from "./profiles.model";
const ScoreMovies = db.define(
	"score_movies",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		profile_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Profiles,
				key: "id",
			},
		},
		movie_id: {
			type: DataTypes.INTEGER,
		},
		score: {
			type: DataTypes.TINYINT,
		},
		review: {
			type: DataTypes.TEXT
		},
	},
	{
		createdAt: false,
		updatedAt: false,
		omitNull: false
	}
);
export default ScoreMovies;
