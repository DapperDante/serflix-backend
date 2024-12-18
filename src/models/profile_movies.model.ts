import { DataTypes } from 'sequelize'
import db from '../db/connection'
import Profiles from './profiles.model';
const ProfileMovies = db.define('profile_movies', {
    id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    profile_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: Profiles,
            key: 'id'
        }
    },
    movie_id: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    is_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    createdAt: false,
    updatedAt: false
})
export default ProfileMovies;