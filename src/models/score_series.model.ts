import { DataTypes } from "sequelize";
import db from '../db/connection';
import Profiles from "./profiles.model";
const ScoreSeries = db.define('score_series', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	profile_id: {
		type: DataTypes.INTEGER,
		references: {
			model: Profiles,
			key: 'id'
		}
	},
	serie_id: {
		type: DataTypes.INTEGER
	},
	score: {
		type: DataTypes.TINYINT
	},
	review: {
		type: DataTypes.INTEGER
	}
}, {
	createdAt: false,
	updatedAt: false,
	omitNull: false
});
export default ScoreSeries;