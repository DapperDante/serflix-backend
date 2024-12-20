import { DataTypes } from 'sequelize'
import db from '../db/connection'
import Profiles from './profiles.model';
const ProfileSeries = db.define('profile_series', {
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
    serie_id: {
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
export default ProfileSeries;