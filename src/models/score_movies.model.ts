import { DataTypes } from "sequelize";
import db from '../db/connection';
import Profiles from "./profiles.model";
const ScoreMovies = db.define('score_movies', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    profile_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Profiles,
            key: 'id'
        },
        allowNull: false
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});
export default ScoreMovies;