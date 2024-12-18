import { DataTypes } from 'sequelize'
import db from '../db/connection'
import Profiles from './profiles.model';
const ProfileSeries = db.define('profile_series', {
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
    }
}, {
    createdAt: false,
    updatedAt: false
})
export default ProfileSeries;